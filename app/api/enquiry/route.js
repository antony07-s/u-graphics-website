import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Enquiry from "@/models/Enquiry";
import SiteSettings from "@/models/SiteSettings";
import nodemailer from "nodemailer";
import { z } from "zod";
import { defaultEnquiryRecipient } from "@/lib/enquiryConfig";

const enquirySchema = z.object({
  name: z.string().trim().min(2).max(100),
  phone: z.string().trim().regex(/^[0-9+()\-\s]{7,20}$/),
  email: z.string().trim().email().optional().or(z.literal("")),
  serviceCategory: z.string().trim().max(120).optional(),
  message: z.string().trim().max(2000).optional(),
  attachmentUrl: z.string().url().optional(),
});

const escapeHtml = (value) => String(value || "-")
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;")
  .replace(/'/g, "&#039;");

// GET /api/enquiry -> list all enquiries, newest first (admin/editor only)
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user || !["admin", "editor"].includes(session.user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectDB();
  const enquiries = await Enquiry.find({}).sort({ createdAt: -1 });
  return NextResponse.json({ enquiries });
}

// POST /api/enquiry -> save enquiry + send email notification
export async function POST(request) {
  try {
    await connectDB();
    const parsed = enquirySchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Please provide a valid name, phone number and optional contact details." },
        { status: 400 }
      );
    }
    const { name, phone, email, serviceCategory, message, attachmentUrl } = parsed.data;

    const enquiry = await Enquiry.create({
      name,
      phone,
      email,
      serviceCategory,
      message,
      attachmentUrl,
    });

    // Send email notification (non-blocking failure — enquiry is already saved)
    // Delivery failure never discards the database record.
    const settings = await SiteSettings.findOne({ key: "primary" }).lean();
    const recipient = settings?.enquiryRecipientEmail || defaultEnquiryRecipient;
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS && recipient) try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: Number(process.env.SMTP_PORT) === 465,
        // Keep certificate verification enabled unless a self-hosted SMTP
        // service explicitly requires the deployment setting to disable it.
        tls: process.env.SMTP_TLS_REJECT_UNAUTHORIZED === "false"
          ? { rejectUnauthorized: false }
          : undefined,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      await transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: recipient,
        subject: `New Enquiry from ${name} - U Graphics`,
        html: `
          <h2>New Website Enquiry</h2>
          <p><b>Name:</b> ${escapeHtml(name)}</p>
          <p><b>Phone:</b> ${escapeHtml(phone)}</p>
          <p><b>Email:</b> ${escapeHtml(email)}</p>
          <p><b>Service:</b> ${escapeHtml(serviceCategory)}</p>
          <p><b>Message:</b> ${escapeHtml(message)}</p>
        `,
      });
      await Enquiry.findByIdAndUpdate(enquiry._id, {
        emailStatus: "sent",
        emailSentAt: new Date(),
      });
    } catch (emailError) {
      console.error("Email notification failed:", emailError);
      await Enquiry.findByIdAndUpdate(enquiry._id, { emailStatus: "failed" });
    }

    return NextResponse.json({ enquiry }, { status: 201 });
  } catch (error) {
    console.error("Enquiry submission failed:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
