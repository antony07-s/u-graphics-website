require("dotenv").config({ path: ".env.local" });
const nodemailer = require("nodemailer");

(async () => {
  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    tls: { rejectUnauthorized: process.env.SMTP_TLS_REJECT_UNAUTHORIZED !== "false" },
  });

  try {
    await transport.verify();
    console.log("SMTP connection successful!");

    await transport.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.SMTP_USER, // sending a test email to yourself
      subject: "Test Email - U Graphics",
      text: "If you received this, your email setup works correctly.",
    });
    console.log("Test email sent successfully! Check your inbox.");
  } catch (error) {
    console.error("REAL ERROR:", error.message);
    console.error("Full details:", error);
  }
  process.exit(0);
})();
