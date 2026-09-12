import nodemailer from "nodemailer";

export function mailer() {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) return null;
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    tls: { rejectUnauthorized: process.env.SMTP_TLS_REJECT_UNAUTHORIZED !== "false" },
  });
}

export async function sendCustomerOtp({ email, code, purpose }) {
  const transport = mailer();
  if (!transport) throw new Error("Email delivery is unavailable.");
  const heading = purpose === "register" ? "Verify your U Graphics account" : "Reset your U Graphics password";
  await transport.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: email,
    subject: heading,
    text: `${heading}. Your one-time code is ${code}. It expires in 10 minutes. Do not share this code.`,
    html: `<p>${heading}</p><p>Your one-time code is <strong style="font-size:22px;letter-spacing:4px">${code}</strong>.</p><p>This code expires in 10 minutes. Do not share it with anyone.</p>`,
  });
}

