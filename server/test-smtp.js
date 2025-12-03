const nodemailer = require("nodemailer");

async function testSMTP() {
  const transporter = nodemailer.createTransport({
    host: "mail.decart.ps",
    port: 465,
    secure: true,
    auth: {
      user: "shop@decart.ps",
      pass: "Decart2024@!",
    },
    tls: { rejectUnauthorized: false },
  });

  try {
    console.log("🔌 Verifying connection...");
    await transporter.verify();
    console.log("✅ Connected successfully!");

    await transporter.sendMail({
      from: '"Decart Test" <shop@decart.ps>',
      to: "majd.odi2018@gmail.com",
      subject: "SMTP Test from localhost",
      text: "✅ This email confirms SMTP works!",
    });

    console.log("✅ Email sent successfully!");
  } catch (err) {
    console.error("❌ SMTP Error:");
    console.error("Message:", err.message);
    console.error("Code:", err.code);
    console.error("Response:", err.response);
  }
}

testSMTP();
