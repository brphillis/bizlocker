import { randomUUID } from "crypto";
import { Readable } from "node:stream";
import { Image } from "@prisma/client";
import {
  base64toBufferedBinary,
  getImageTypeFromBase64,
} from "~/helpers/fileHelpers";
import {
  CopyObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import getStream, {
  AnyStream,
} from "../../../../node_modules/get-stream/source";
import { CURRENT_BUCKET } from "~/build/clientEnv";
import { removeSpecialCharacters } from "~/helpers/stringHelpers";

export const bucketName_currentEnv = CURRENT_BUCKET;
export const bucketName_prod = process.env.AWS_BUCKET;
export const bucketName_dev = process.env.AWS_BUCKET + "-dev";

export const s3Client = new S3Client({
  region: "ap-southeast-2",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS!,
    secretAccessKey: process.env.AWS_SECRET!,
  },
});

// CREATE
export const handleS3Upload = async (image: Image) => {
  // if we are already passing an image object to this function we just want to return existing link
  // as we are iterating through an array of images in which some arent updated
  if (!image.href) {
    throw new Error("invalid image, no href. function: handleS3Upload");
  }

  if (image.href?.includes("https")) {
    return image.href;
  }

  const binaryData = base64toBufferedBinary(image.href);
  const fileType = getImageTypeFromBase64(image.href!);

  const contentRepoLink = await uploadFileToS3(
    image?.altText || "image",
    binaryData,
    fileType,
  );
  return contentRepoLink;
};

export const uploadFileToS3 = async (
  altText: string,
  fileData: Buffer,
  fileType: string,
): Promise<string> => {
  try {
    const key = randomUUID() + "-" + removeSpecialCharacters(altText);

    const params = {
      Bucket: bucketName_currentEnv,
      Key: key,
      Body: fileData,
      ContentType: fileType,
    };

    await s3Client.send(new PutObjectCommand(params));

    const fileUrl = `https://${bucketName_currentEnv}.s3.ap-southeast-2.amazonaws.com/${key}`;
    return fileUrl;
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    throw error;
  }
};

// UPDATE
export const handleS3Update = async (existingImage: Image, newImage: Image) => {
  // if we are already passing an image object to this function we just want to return existing link
  // as we are iterating through an array of images in which some arent updated

  if (!newImage.href) {
    throw new Error("invalid image, no href. function: handleS3Upate");
  }

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
    );
    return contentRepoLink;
  }
};

export const updateS3File = async (
  href: string,
  fileData: Buffer,
  fileType: string,
): Promise<string> => {
  try {
    const key = href?.split("/").pop();

    const params = {
      Bucket: bucketName_currentEnv,
      Key: key,
      Body: fileData,
      ContentType: fileType,
    };

    await s3Client.send(new PutObjectCommand(params));

    const fileUrl = `https://${bucketName_currentEnv}.s3.ap-southeast-2.amazonaws.com/${key}`;
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
      Bucket: bucketName_currentEnv,
      Key: key,
    }),
  );
};

// FETCH ITEM
export const fetchDataFromS3 = async (objectKey: string) => {
  const params = {
    Bucket: bucketName_currentEnv,
    Key: objectKey,
  };

  const object = await s3Client.send(new GetObjectCommand(params));

  const file_stream = object.Body!;
  let content_buffer: string | null = null;

  if (file_stream instanceof Readable) {
    content_buffer = await getStream(file_stream as AnyStream);
    return content_buffer;
  } else {
    throw new Error("Unknown object stream type.");
  }
};

// GETS ALL IMAGE ENTITY TAGS FROM A BUCKET
export const getImageEntityTagsInBucket = async () => {
  const params = {
    Bucket: bucketName_currentEnv,
  };

  const objects = await s3Client.send(new ListObjectsV2Command(params));

  if (objects.Contents) {
    const objectUrls = objects.Contents.map((object) => {
      return object?.ETag?.replace(/["']/g, "");
    });

    return objectUrls;
  } else {
    throw new Error("Unable to fetch object keys from S3 bucket.");
  }
};

export const listObjectsInBucket = async (bucketName: string) => {
  const params = {
    Bucket: bucketName,
  };
  const response = await s3Client.send(new ListObjectsV2Command(params));
  return response.Contents ?? [];
};

export const duplicateBucket = async (
  sourceBucket: string,
  destinationBucket: string,
) => {
  try {
    const sourceObjects = await listObjectsInBucket(sourceBucket);
    if (sourceObjects && sourceObjects.length > 0) {
      for (const object of sourceObjects) {
        const copyParams = {
          Bucket: destinationBucket,
          CopySource: `/${sourceBucket}/${object.Key}`,
          Key: object.Key,
        };
        await s3Client.send(new CopyObjectCommand(copyParams));
      }
    } else {
      throw new Error("Source bucket is empty or does not exist.");
    }
  } catch (error) {
    console.error("Error duplicating bucket:", error);
    throw error;
  }
};

export const copyProdBucketToDev = async (): Promise<boolean> => {
  if (bucketName_prod) {
    await duplicateBucket(bucketName_prod, bucketName_dev);
    return true;
  } else return false;
};

export const copyDevBucketToProd = async (): Promise<boolean> => {
  if (bucketName_prod) {
    await duplicateBucket(bucketName_dev, bucketName_prod);
    return true;
  } else return false;
};
