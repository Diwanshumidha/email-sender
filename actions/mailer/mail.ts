"use server";
import { emailQueue } from "@/app/api/queues/mail/route";
import { MAX_MAIL_LIMIT } from "@/lib/constant";
import transporter from "@/lib/mail/nodemailer";
import { EnqueueJobOpts } from "quirrel";

interface SendMailProps {
  to: string;
  subject: string;
  text: string;
}

type jobs = { payload: any; options?: EnqueueJobOpts }[];

export const server_sendMail = async ({ to, subject, text }: SendMailProps) => {
  try {
    emailQueue.enqueue({ to, subject, text });
  } catch (error) {
    console.log(error);
    return {
      error: "Something Went Wrong",
    };
  }
};

export const server_sendMails = async (mails: SendMailProps[]) => {
  try {
    if (mails.length > MAX_MAIL_LIMIT) {
      return {
        error: "Too many emails",
      };
    }

    const jobs = mails.map((mail) => ({
      payload: mail,
    })) satisfies jobs;

    await emailQueue.enqueueMany(jobs);
    return {
      success: true,
    };
  } catch (error) {
    console.error(error);
    return {
      error: "Something Went Wrong See the server console",
    };
  }
};
