import type { Image } from "@prisma/client";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  PutObjectAclCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { Readable } from "node:stream";
import getStream from "../../../../node_modules/get-stream/source";
import {
  base64toBufferedBinary,
  getImageTypeFromBase64,
} from "~/helpers/fileHelpers";
import { randomUUID } from "crypto";

const bucketName = "clutchclothing";

export const s3Client = new S3Client({
  region: "ap-southeast-2",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS!,
    secretAccessKey: process.env.AWS_SECRET!,
  },
});

// CREATE
export const handleS3Upload = async (image: Image, secureLink?: boolean) => {
  // if we are already passing an image object to this function we just want to return existing link
  // as we are iterating through an array of images in which some arent updated
  if (image.href?.includes("https")) {
    return image.href;
  }

  const binaryData = base64toBufferedBinary(image?.href);
  const fileType = getImageTypeFromBase64(image.href!);

  const contentRepoLink = await uploadFileToS3(
    image?.altText || "image",
    binaryData,
    fileType,
    secureLink
  );
  return contentRepoLink;
};

export const uploadFileToS3 = async (
  altText: string,
  fileData: Buffer,
  fileType: string,
  secureImage?: boolean
): Promise<string> => {
  try {
    const key = randomUUID() + "-" + altText;

    const params = {
      Bucket: bucketName,
      Key: key,
      Body: fileData,
      ContentType: fileType,
    };

    await s3Client.send(new PutObjectCommand(params));

    if (!secureImage) {
      await s3Client.send(
        new PutObjectAclCommand({
          Bucket: bucketName,
          Key: key,
          ACL: "public-read",
        })
      );
    }

    const fileUrl = `https://${bucketName}.s3.ap-southeast-2.amazonaws.com/${key}`;
    return fileUrl;
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    throw error;
  }
};

// UPDATE
export const handleS3Update = async (
  existingImage: Image,
  newImage: Image,
  secureLink?: boolean
) => {
  // if we are already passing an image object to this function we just want to return existing link
  // as we are iterating through an array of images in which some arent updated
  if (newImage.href?.includes("https")) {
    return newImage.href;
  }

  const binaryData = base64toBufferedBinary(newImage.href);
  const fileType = getImageTypeFromBase64(newImage.href!);

  if (existingImage.href) {
    const contentRepoLink = await updateS3File(
      existingImage.href,
      binaryData,
      fileType,
      secureLink
    );
    return contentRepoLink;
  }
};

export const updateS3File = async (
  href: string,
  fileData: Buffer,
  fileType: string,
  secureImage?: boolean
): Promise<string> => {
  try {
    const key = href?.split("/").pop();

    const params = {
      Bucket: bucketName,
      Key: key,
      Body: fileData,
      ContentType: fileType,
    };

    await s3Client.send(new PutObjectCommand(params));

    if (!secureImage) {
      await s3Client.send(
        new PutObjectAclCommand({
          Bucket: bucketName,
          Key: key,
          ACL: "public-read",
        })
      );
    }

    const fileUrl = `https://${bucketName}.s3.ap-southeast-2.amazonaws.com/${key}`;
    return fileUrl;
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    throw error;
  }
};

// DELETE
export const removeS3Image = async (imageURL: string) => {
  const key = imageURL.split("/").pop();

  await s3Client.send(
    new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key,
    })
  );
};

// FETCH ITEM
export const fetchDataFromS3 = async (objectKey: string) => {
  const params = {
    Bucket: bucketName,
    Key: objectKey,
  };

  const object = await s3Client.send(new GetObjectCommand(params));

  const file_stream = object.Body!;
  let content_buffer: string | null = null;

  if (file_stream instanceof Readable) {
    content_buffer = await getStream(file_stream as any);
    return content_buffer;
  } else {
    throw new Error("Unknown object stream type.");
  }
};
