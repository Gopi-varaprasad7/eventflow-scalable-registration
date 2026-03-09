import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
export const sendConfirmationEmail = async (
  email: string,
  eventTitle: string
) => {

  const mailOptions = {
    from: `"EventFlow" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Registration Confirmed for ${eventTitle}`,
    text: `You are successfully registered for ${eventTitle}`,
    html: `
      <h2>Registration Confirmed 🎉</h2>
      <p>You are successfully registered for:</p>
      <b>${eventTitle}</b>
    `
  };

  await transporter.sendMail(mailOptions);
};