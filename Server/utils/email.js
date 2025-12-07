// utils/email.js
require('dotenv').config(); // safe here too, just to be sure

const nodemailer = require('nodemailer');



const sendEmail = async (options) => {
  console.log('➡️ sendEmail called with:', options);

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent OK:', info.messageId);
    return info;
  } catch (err) {
    console.error('❌ Error in sendEmail:', err.message);
    if (err.response) console.error('SMTP response:', err.response);
    throw err;
  }
};

module.exports = sendEmail;
