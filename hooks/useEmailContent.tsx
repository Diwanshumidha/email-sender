import React from "react";
import { useLocalStorage } from "@uidotdev/usehooks";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface IEmailContent {
  subject: string;
  body: string;
}

interface EmailState {
  EmailContent: IEmailContent;
  setEmailContent: (content: IEmailContent) => void;
}

export const useEmailContentStore = create<EmailState>()(
  persist(
    (set) => ({
      EmailContent: {
        body: "",
        subject: "",
      },
      setEmailContent(content) {
        set((state) => ({ ...state, EmailContent: content }));
      },
    }),
    { name: "email-content" }
  )
);
