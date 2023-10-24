import { type ChangeEvent } from "react";

export const ConvertToBase64Image = async (
  event: ChangeEvent<HTMLInputElement>
): Promise<Image | undefined> => {
  const file = event.target.files?.[0];
  if (file && file.type.includes("image")) {
    return new Promise<Image | undefined>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64string = reader.result as string; // Get the base64 string from the FileReader

        const newImage: Image = {
          href: base64string, // Store the base64 string in the blob property
          repoLink: base64string,
          altText: event.target.files?.[0].name || "",
        };

        resolve(newImage);
      };
      reader.onerror = () => {
        reject(new Error("Failed to read the file."));
      };
      reader.readAsDataURL(file); // Read as Data URL (base64 string)
    });
  } else {
    return undefined;
  }
};

export const base64toBufferedBinary = (dataURI: any) => {
  var BASE64_MARKER = ";base64,";
  var base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
  var base64 = dataURI.substring(base64Index);
  var raw = atob(base64);
  var rawLength = raw.length;
  var array = new Uint8Array(new ArrayBuffer(rawLength));

  for (var i = 0; i < rawLength; i++) {
    array[i] = raw.charCodeAt(i);
  }
  return Buffer.from(array);
};

export const getImageTypeFromBase64 = (base64String: string): string => {
  // Extract the data URI header (e.g., "data:image/jpeg;base64")
  const header = base64String.split(";")[0];

  // Extract the image type from the header
  const imageType = header.split(":")[1];

  return imageType;
};
