const nodemailer = require("nodemailer");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

(async () => {
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
    await transporter.sendMail({
      from: `"DECART Test" <${process.env.EMAIL_USERNAME}>`,
      to: "shop@decart.ps", // أرسل لنفس الإيميل كاختبار
      subject: "SMTP Test ✅",
      text: "If you received this, SMTP is working correctly.",
    });
  } catch {}
})();
