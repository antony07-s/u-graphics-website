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

    // Send email notifications (non-blocking failure — enquiry is already saved)
    // Delivery failure never discards the database record.
    const settings = await SiteSettings.findOne({ key: "primary" }).lean();
    const recipient = settings?.enquiryRecipientEmail || defaultEnquiryRecipient;

    let transporter = null;
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: Number(process.env.SMTP_PORT) === 465,
        tls: process.env.SMTP_TLS_REJECT_UNAUTHORIZED === "false"
          ? { rejectUnauthorized: false }
          : undefined,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    }

    // 1. Notify the U Graphics team of the new enquiry.
    if (transporter && recipient) {
      try {
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
    }

    // 2. Send a thank-you confirmation to the person who submitted the form,
    // only if they gave an email. Kept fully independent of the admin
    // notification above — one failing never affects the other.
    if (transporter && email) {
      try {
        const whatsapp = settings?.whatsapp;
        await transporter.sendMail({
          from: process.env.SMTP_FROM || process.env.SMTP_USER,
          to: email,
          subject: "Thanks for reaching out to U Graphics",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
              <h2 style="color:#0b3d91;">Thanks, ${escapeHtml(name)}!</h2>
              <p>We've received your enquiry${
                serviceCategory ? ` about <b>${escapeHtml(serviceCategory)}</b>` : ""
              } and our team will get back to you shortly — usually within 24 hours.</p>
              ${
                message
                  ? `<p style="background:#f5f5f5;padding:12px;border-radius:8px;"><b>Your message:</b><br/>${escapeHtml(
                      message
                    )}</p>`
                  : ""
              }
              ${
                whatsapp
                  ? `<p>Need a faster response? Message us directly on <a href="https://wa.me/${whatsapp}" style="color:#25D366;">WhatsApp</a>.</p>`
                  : ""
              }
              <p style="margin-top:24px;color:#888;font-size:12px;">— U Graphics Team</p>
            </div>
          `,
        });
      } catch (customerEmailError) {
        console.error("Thank-you email failed:", customerEmailError);
      }
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