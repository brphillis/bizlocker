import { json } from "@remix-run/node";
import type { Image } from "@prisma/client";
import type { Params } from "@remix-run/react";
import { validateForm } from "~/utility/validate";
import type { PageNotification } from "~/hooks/PageNotification";
import {
  deleteImage,
  getImage,
  type ImageWithDetails,
  upsertImage,
} from "~/models/images.server";

const validateOptions = {
  image: true,
  altText: true,
};

export const imageUpsertLoader = async (
  request: Request,
  params: Params<string>,
) => {
  let { searchParams } = new URL(request.url);
  let id = searchParams.get("contentId");

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

export const imageUpsertAction = async (
  request: Request,
  params: Params<string>,
) => {
  let notification: PageNotification;

  let { searchParams } = new URL(request.url);
  const contentId = searchParams.get("contentId");
  let id = contentId === "add" || !contentId ? undefined : contentId;

  const { formEntries, formErrors } = validateForm(
    await request.formData(),
    validateOptions,
  );

  const { image, altText } = formEntries;

  switch (formEntries._action) {
    case "upsert":
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

    case "delete":
      await deleteImage(id as string);

      notification = {
        type: "warning",
        message: "Image Deleted",
      };

      return json({ success: true, notification });
  }
};
