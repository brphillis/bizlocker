import { type ChangeEvent } from "react";

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
