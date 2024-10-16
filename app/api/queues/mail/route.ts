import transporter from "@/lib/mail/nodemailer";
import { Queue } from "quirrel/next-app";

interface SendMailProps {
  to: string;
  subject: string;
  text: string;
}

export const emailQueue = Queue("api/queues/mail", async (job) => {
  const { to, subject, text } = job as SendMailProps;

  try {
    const info = await transporter.sendMail({
      from: process.env.FROM_EMAIL_ADDRESS,
      to,
      subject,
      text,
    });
    
    console.log("Mail sent");

    if (info.rejected.length > 0) {
      console.log("Rejected:", info.rejected);
      throw new Error("Error Sending Mail");
    }
  } catch (err) {
    console.log("Error sending mail:");
    console.log(err);
    throw new Error("Error Sending Mail");
  }
});

export const POST = emailQueue;
