const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  auth: {
    user: process.env.BREVO_SMTP_USER,
    pass: process.env.BREVO_API_KEY,
  },
});

const sendWelcomeEmail = async (toEmail, name) => {
  await transporter.sendMail({
    from: `"ResuMatch" <${process.env.FROM_EMAIL}>`,
    to: toEmail,
    subject: "Welcome to ResuMatch!",
    html: `<h1>Welcome ${name}!</h1><p>Your AI-powered job matching journey starts now.</p>`,
  });
};

module.exports = { sendWelcomeEmail };
