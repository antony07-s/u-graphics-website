import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Enquiry from "@/models/Enquiry";
import nodemailer from "nodemailer";
import { z } from "zod";

const enquirySchema = z.object({
  name: z.string().trim().min(2).max(100),
  phone: z.string().trim().regex(/^[0-9+()\-\s]{7,20}$/),
  email: z.string().trim().email().optional().or(z.literal("")),
  serviceCategory: z.string().trim().max(120).optional(),
  message: z.string().trim().max(2000).optional(),
  attachmentUrl: z.string().url().optional(),
});

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
    const parsed = enquirySchema.safeParse(await request.json());
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
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS && process.env.ENQUIRY_RECEIVER_EMAIL) try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: process.env.ENQUIRY_RECEIVER_EMAIL,
        subject: `New Enquiry from ${name} - U Graphics`,
        html: `
          <h2>New Website Enquiry</h2>
          <p><b>Name:</b> ${name}</p>
          <p><b>Phone:</b> ${phone}</p>
          <p><b>Email:</b> ${email || "-"}</p>
          <p><b>Service:</b> ${serviceCategory || "-"}</p>
          <p><b>Message:</b> ${message || "-"}</p>
        `,
      });
    } catch (emailError) {
      console.error("Email notification failed:", emailError);
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