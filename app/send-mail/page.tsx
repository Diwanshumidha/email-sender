"use client";
import { server_sendMail } from "@/actions/mailer/mail";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useEmailContentStore } from "@/hooks/useEmailContent";
import { TransformEmailContent } from "@/lib/utils";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const Page = () => {
  const { EmailContent } = useEmailContentStore();

  const [body, setBody] = useState(EmailContent.body);
  const [subject, setSubject] = useState(EmailContent.subject);
  const [email, setEmail] = useState(EmailContent.subject);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setBody(EmailContent.body);
    setSubject(EmailContent.subject);
  }, [EmailContent]);

  const handleSendMail = async () => {
    try {
      const transformedSubject = TransformEmailContent(subject, {
        email: email,
        name: name,
      });

      const transformedBody = TransformEmailContent(body, {
        email: email,
        name: name,
      });

      setLoading(true);
      setError(null);

      const payload = {
        subject: transformedSubject,
        text: transformedBody,
        to: email,
      };
      console.log(payload);
      const res = await server_sendMail(payload);

      if (res?.error) {
        console.error(res.error);
        setError(res.error);
        return;
      }

      toast.success("Emails sent successfully");
    } catch (err) {
      console.error("Error sending emails:", err);
      setError("An error occurred while sending emails.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" flex justify-center items-center w-full h-svh ">
      <Card className="w-1/2 max-w-[800px]">
        <CardHeader>
          <CardTitle>Content</CardTitle>
          <CardDescription className="text-xs">
            <span className="text-primary font-semibold"> {`{{name}} `}</span>
            for the Name of The Receiver
            <span className="text-primary font-semibold">{` {{email}} `}</span>{" "}
            for the email
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="userName">Name</Label>
              <Input
                id="userName"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="Email (example@gmail.com)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Subject</Label>
              <Input
                id="name"
                placeholder="Subject of the emails"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="body">Body</Label>
              <Textarea
                id="body"
                rows={10}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Enter The Body"
              />
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex gap-3 justify-end">
          <Button onClick={handleSendMail}>Send Mail</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Page;
