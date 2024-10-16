import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import csv from "csvtojson";
import { IEmailContent } from "@/hooks/useEmailContent";

export const processCsvFile = async (
  file: File,
  emailContent: IEmailContent,
  onInvalidRows: (count: number) => void,
  onValidRows: (rows: any[]) => void,
  onError: (error: string) => void
) => {
  const reader = new FileReader();
  reader.onload = async (event) => {
    const csvString = event.target?.result as string;
    try {
      const jsonArray = await csv().fromString(csvString);
      console.log("CSV to JSON:", jsonArray);
      const invalidRows = jsonArray.filter(
        (item: any, index: number) => !item.FIRSTNAME || !item.EMAIL || !item.COMPANYNAME
      );

      if (invalidRows.length > 0) {
        onInvalidRows(invalidRows.length);
      } else {
        const emails = jsonArray.map((item: any) => ({
          to: item.EMAIL,
          name: item.FIRSTNAME,
          subject: TransformEmailContent(emailContent.subject, {
            name: item.FIRSTNAME,
            email: item.EMAIL,
            companyName: item.COMPANYNAME
          }),
          text: TransformEmailContent(emailContent.body, {
            name: item.FIRSTNAME,
            email: item.EMAIL,
            companyName: item.COMPANYNAME
          }),
        }));
        onValidRows(emails);
      }
    } catch (error) {
      console.error("Error converting CSV to JSON:", error);
      onError("Error converting CSV to JSON.");
    }
  };

  reader.onerror = (error) => {
    console.error("File Reader Error:", error);
    onError("File reading failed.");
  };

  reader.readAsText(file);
};

export const TransformEmailContent = (
  content: string,
  userDetails: { name: string; email: string, companyName: string }
) => {
  // Replace {{name}} and {{email}}
  const transformedContent = content
    .replaceAll(/{{name}}/g, userDetails.name)
    .replaceAll(/{{email}}/g, userDetails.email)
    .replaceAll(/{{companyName}}/g, userDetails.companyName)
  return transformedContent;
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
