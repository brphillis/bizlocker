import { Image } from "@prisma/client";
import { extractGuidFromUrl } from "~/helpers/stringHelpers";
import {
  getImageEntityTagsInBucket,
  removeS3Image,
} from "~/integrations/aws/s3/s3.server";
import { getImages } from "../Images/index.server";

export const cleanBucketTask = async () => {
  // if image does not exist in the data but exists in the bucket, we delete from the bucket
  try {
    const imagesInDatabase = await getImages();

    const imageGUIDsFromBucket = await getImageEntityTagsInBucket();
    const imageGUIDsFromDatabase = imagesInDatabase.map(
      ({ href }: Image) => href && extractGuidFromUrl(href),
    );

    for (const imageGUIDFromBucket of imageGUIDsFromBucket) {
      if (
        imageGUIDFromBucket &&
        !imageGUIDsFromDatabase.includes(imageGUIDFromBucket) // Convert to lowercase
      ) {
        await removeS3Image(imageGUIDFromBucket);
      }
    }

    return true;
  } catch (error) {
    console.error("Error during bucket cleanup task:", error);
  }
};

// clutch-sitemap-generator1
export const updateSiteMapTask = async (): Promise<boolean> => {
  const host = process.env.SITEMAP_GENERATOR_CONTAINER;
  const port = process.env.SITEMAP_GENERATOR_PORT;
  const website = process.env.SITE_URL;

  const url = `http://${host}:${port}/sitemap?url=${website}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }

  const serviceTypesJSON = await response.json();

  console.log("RES", serviceTypesJSON);

  return serviceTypesJSON;
};
