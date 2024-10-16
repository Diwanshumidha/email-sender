"use client";
import { server_sendMail, server_sendMails } from "@/actions/mailer/mail";
import React, { useState, useCallback } from "react";
import { processCsvFile } from "@/lib/utils";
import { csvFileSchema } from "@/lib/zod/csv.schema";
import { MAX_MAIL_LIMIT } from "@/lib/constant";
import { useEmailContentStore } from "@/hooks/useEmailContent";
import { useLocalStorage } from "@uidotdev/usehooks";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type Recipient = {
  to: string;
  name: string;
  subject: string;
  text: string;
};

const Page = () => {
  const [recipients, setRecipients] = useLocalStorage<Recipient[]>(
    "recipients",
    []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { EmailContent } = useEmailContentStore();

  const deleteAllRecipients = () => {
    setRecipients([]);
  };

  const sendEmail = async (index: number) => {
    try {
      setLoading(true);
      const recipient = recipients[index];
      await server_sendMail({
        to: recipient.to,
        subject: recipient.subject,
        text: recipient.text,
      });

      setRecipients((prev) => prev.filter((_, i) => i !== index));
    } catch {
      setError("Failed to send email");
    } finally {
      setLoading(false);
    }
  };

  const sendEmails = async () => {
    setLoading(true);
    setError(null);

    const topRecipients = recipients.slice(0, MAX_MAIL_LIMIT);

    try {
      const res = await server_sendMails(topRecipients);
      if (res.error) {
        console.error(res.error);
        setError(res.error);
        return;
      }

      setRecipients(recipients.slice(MAX_MAIL_LIMIT));
      toast.success("Emails sent successfully");
    } catch (err) {
      console.error("Error sending emails:", err);
      setError("An error occurred while sending emails.");
    } finally {
      setLoading(false);
    }
  };

  const handleCsvUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      const file = e.target.files?.[0];
      console.log("File:", file);
      const parsed = csvFileSchema.safeParse(file);
      if (!parsed.success) {
        return setError("Invalid CSV file. Please check the format.");
      }
      const parsedFile = parsed.data;

      setError(null);
      processCsvFile(
        parsedFile,
        { body: EmailContent.body, subject: EmailContent.subject },
        (invalidCount) =>
          setError(
            `There are ${invalidCount} invalid rows in the CSV file. Check the console for details.`
          ),
        (validRows) => setRecipients(validRows),
        (error) => setError(error)
      );
    },
    [EmailContent, setRecipients]
  );

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4 flex justify-end">
        {recipients.length >= 1 ? (
          <div className="mt-4 flex gap-3">
            <Button
              onClick={() => deleteAllRecipients()}
              variant={"destructive"}
            >
              Delete All
            </Button>

            <button
              onClick={sendEmails}
              disabled={loading || recipients.length === 0}
              className="bg-blue-500 text-white py-2 px-4 rounded disabled:opacity-50"
            >
              {loading ? "Sending..." : `Send Top ${MAX_MAIL_LIMIT} Email`}
            </button>
          </div>
        ) : null}
      </div>
      {error && <p className="text-red-500">{error}</p>}

      {recipients.length === 0 ? (
        <div className="w-full h-svh flex justify-center items-center">
          <input
            type="file"
            onChange={handleCsvUpload}
            className="border p-2"
          />
        </div>
      ) : null}

      <div className="overflow-x-auto text-black">
        {recipients.length > 0 && (
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="py-2 text-left px-4 border-b">Sr no</th>
                <th className="py-2 text-left px-4 border-b">To</th>
                <th className="py-2 text-left px-4 border-b">Name</th>
                <th className="py-2 text-left px-4 border-b">Subject</th>
                <th className="py-2 text-left px-4 border-b">Action</th>
              </tr>
            </thead>
            <tbody>
              {recipients.map((r, index) => (
                <tr key={index} className="even:bg-gray-100">
                  <td className="py-2 px-4 border-b">{index + 1}</td>
                  <td className="py-2 px-4 border-b">{r.to}</td>
                  <td className="py-2 px-4 border-b">{r.name}</td>
                  <td className="py-2 px-4 border-b">{r.subject}</td>
                  <td className="py-2 px-4 border-b">
                    <button onClick={() => sendEmail(index)} disabled={loading}>
                      Send Mail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Page;
