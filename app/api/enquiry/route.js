import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Enquiry from "@/models/Enquiry";
import nodemailer from "nodemailer";

// POST /api/enquiry -> save enquiry + send email notification
export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();

    const { name, phone, email, serviceCategory, message, attachmentUrl } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { error: "Name and phone are required." },
        { status: 400 }
      );
    }

    const enquiry = await Enquiry.create({
      name,
      phone,
      email,
      serviceCategory,
      message,
      attachmentUrl,
    });

    // Send email notification (non-blocking failure — enquiry is already saved)
    try {
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
