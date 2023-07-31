import fs from "fs";
import path from "path";

export const staticPathImageToBase64 = (fileName: string): string => {
  const absoluteFilePath = path.join(
    process.cwd(),
    "public",
    "email-assets",
    fileName
  );
  const fileData = fs.readFileSync(absoluteFilePath);
  return fileData.toString("base64");
};
