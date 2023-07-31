import { type ChangeEvent } from "react";
import fs from "fs";

export const ConvertToBase64 = async (
  event: ChangeEvent<HTMLInputElement>
): Promise<Image | undefined> => {
  const file = event.target.files?.[0];
  if (file && file.type.includes("image")) {
    return new Promise<Image | undefined>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;

        const newImage: Image = {
          url: base64String,
          altText: event.target.files?.[0].name || "",
        };
        resolve(newImage);
      };
      reader.onerror = () => {
        reject(new Error("Failed to read the file."));
      };
      reader.readAsDataURL(file);
    });
  } else {
    return undefined;
  }
};

export const encodeImageToBase64 = (imagePath: string): string => {
  try {
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString("base64");
    return base64Image;
  } catch (error) {
    console.error(
      "Error while encoding image to base64:",
      (error as Error).message
    );
    return "";
  }
};
