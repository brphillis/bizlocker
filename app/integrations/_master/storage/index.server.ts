import type { Image } from "@prisma/client";
import {
  handleS3Update,
  handleS3Upload,
  removeS3Image,
} from "~/integrations/aws/s3/s3.server";

export const uploadImage_Integration = async (image: Image) => {
  return await handleS3Upload(image);
};

export const updateImage_Integration = async (
  existingImage: Image,
  newImage: Image,
) => {
  return await handleS3Update(existingImage, newImage);
};

export const deleteImage_Integration = async (imageURL: string) => {
  return await removeS3Image(imageURL);
};
