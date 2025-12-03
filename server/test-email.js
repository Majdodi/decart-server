const nodemailer = require("nodemailer");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

console.log("========= ENV CHECK =========");
console.log("EMAIL_HOST:", process.env.EMAIL_HOST);
console.log("EMAIL_PORT:", process.env.EMAIL_PORT);
console.log("EMAIL_SECURE:", process.env.EMAIL_SECURE);
console.log("EMAIL_USERNAME:", process.env.EMAIL_USERNAME);
console.log("EMAIL_PASSWORD:", process.env.EMAIL_PASSWORD ? "(Loaded ✅)" : "(❌ MISSING)");
console.log("=============================");

(async () => {
  console.log("📧 Testing connection...");

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: process.env.EMAIL_SECURE === "true", // true for 465, false for 587
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: `"DECART Test" <${process.env.EMAIL_USERNAME}>`,
      to: "shop@decart.ps", // أرسل لنفس الإيميل كاختبار
      subject: "SMTP Test ✅",
      text: "If you received this, SMTP is working correctly.",
    });

    console.log("✅ Email sent successfully!");
    console.log("📨 Message ID:", info.messageId);
  } catch (err) {
    console.error("❌ SMTP test error:", err);
  }
})();
