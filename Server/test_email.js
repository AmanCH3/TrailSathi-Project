// test-email.js
require('dotenv').config();
const nodemailer = require('nodemailer');

(async () => {
  try {
    console.log('EMAIL_USER:', process.env.EMAIL_USER);
    console.log('EMAIL_PASS is set:', !!process.env.EMAIL_PASS);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // send to yourself
      subject: 'Test email from Node',
      text: 'If you see this, Nodemailer + Gmail works 🎉',
    });

    console.log('✅ Test email sent:', info.messageId);
  } catch (err) {
    console.error('❌ Test email error:', err.message);
    if (err.response) console.error('SMTP response:', err.response);
  }
})();
