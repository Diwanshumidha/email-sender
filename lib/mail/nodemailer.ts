import "server-only";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.resend.com",
  port: 465,
  secure: true,
  replyTo: "support@chatbuild.io",
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
  },
});

export default transporter;
