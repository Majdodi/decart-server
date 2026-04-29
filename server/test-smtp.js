const nodemailer = require("nodemailer");

async function testSMTP() {
  const transporter = nodemailer.createTransport({
    host: "mail.decart.ps",
    port: 465,
    secure: true,
    auth: {
      user: "shop@decart.ps",
      pass: process.env.EMAIL_APP_PASSWORD,
    },
    tls: { rejectUnauthorized: false },
  });

  try {
    await transporter.verify();

    await transporter.sendMail({
      from: '"Decart Test" <shop@decart.ps>',
      to: "majd.odi2018@gmail.com",
      subject: "SMTP Test from localhost",
      text: "✅ This email confirms SMTP works!",
    });
  } catch {}
}

testSMTP();
