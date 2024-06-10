import { z } from "zod";

const validCsvFileType = [
  "text/csv",
  "application/csv",
  "application/vnd.ms-excel",
];
// Zod Schema for a csv file
export const csvFileSchema = z.instanceof(File).refine((file) => {
  if (!file) return false;
  if (!validCsvFileType.includes(file.type)) return false;
  return true;
});
