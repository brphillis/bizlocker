import { json } from "@remix-run/node";
import { Image } from "@prisma/client";
import { validateForm } from "~/utility/validate";
import { ImageWithDetails } from "~/models/Images/types";
import { PageNotification } from "~/hooks/PageNotification";
import {
  deleteImage,
  getImage,
  upsertImage,
} from "~/models/Images/index.server";

const validateOptions = {
  image: true,
  altText: true,
};

export const imageUpsertLoader = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("contentId");

  if (!id) {
    throw new Response(null, {
      status: 404,
      statusText: "Campaign Not Found",
    });
  }

  const image = id === "add" ? ({} as ImageWithDetails) : await getImage(id);

  if (!image) {
    throw new Response(null, {
      status: 404,
      statusText: "Image Not Found",
    });
  }

  return json({ image });
};

export const imageUpsertAction = async (request: Request) => {
  let notification: PageNotification;

  const { searchParams } = new URL(request.url);
  const contentId = searchParams.get("contentId");
  const id = contentId === "add" || !contentId ? undefined : contentId;

  const { formEntries, formErrors } = validateForm(
    await request.formData(),
    validateOptions,
  );

  const { image, altText } = formEntries;

  switch (formEntries._action) {
    case "upsert": {
      if (formErrors) {
        return json({ serverValidationErrors: formErrors });
      }

      const parsedImage = image
        ? (JSON.parse(image?.toString()) as Image)
        : undefined;

      parsedImage && (await upsertImage(altText as string, parsedImage, id));

      notification = {
        type: "success",
        message: `Image ${id === "add" ? "Added" : "Updated"}.`,
      };

      return json({ success: true, notification });
    }

    case "delete": {
      await deleteImage(id as string);

      notification = {
        type: "warning",
        message: "Image Deleted",
      };

      return json({ success: true, notification });
    }
  }
};
