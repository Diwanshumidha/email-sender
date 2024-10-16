"use client";
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
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const Page = () => {
  const { EmailContent, setEmailContent } = useEmailContentStore();

  const [body, setBody] = useState(EmailContent.body);
  const [subject, setSubject] = useState(EmailContent.subject);

  useEffect(() => {
    setBody(EmailContent.body);
    setSubject(EmailContent.subject);
  }, [EmailContent]);

  const handleSave = () => {
    setEmailContent({ body, subject });
    toast.success("Saved!!!");
  };
  return (
    <div className=" flex justify-center items-center w-full h-svh ">
      <Card className="w-[450px]">
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
          <Link
            href={"/send-mail"}
            className={buttonVariants({ variant: "outline" })}
          >
            Send Mail
          </Link>
          <Link
            href={"/send-bulk"}
            className={buttonVariants({ variant: "outline" })}
          >
            Send Mails
          </Link>

          <Button onClick={handleSave}>Save</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Page;
