import { json } from "@remix-run/node";
import type { Params } from "@remix-run/react";
import { validateForm } from "~/utility/validate";
import type { Image } from "~/models/images.server";
import type { PageNotification } from "~/hooks/PageNotification";
import {
  deleteBrand,
  getBrand,
  type BrandWithContent,
  type NewBrand,
  upsertBrand,
} from "~/models/brands.server";

const validateOptions = {
  name: true,
};

export const brandUpsertLoader = async (
  request: Request,
  params: Params<string>,
) => {
  let { searchParams } = new URL(request.url);
  let id = searchParams.get("contentId");

  if (!id) {
    throw new Response(null, {
      status: 404,
      statusText: "Brand Not Found",
    });
  }

  const brand = id === "add" ? ({} as BrandWithContent) : await getBrand(id);

  if (!brand) {
    throw new Response(null, {
      status: 404,
      statusText: "Brand Not Found",
    });
  }

  return json({ brand });
};

export const brandUpsertAction = async (
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

  const { name, image, isActive } = formEntries;

  switch (formEntries._action) {
    case "upsert":
      if (formErrors) {
        return { serverValidationErrors: formErrors };
      }

      const updateData: NewBrand = {
        id: (id as string) || undefined,
        name: name as string,
        image: image ? (JSON.parse(image?.toString()) as Image) : undefined,
        isActive: id ? (isActive ? true : false) : false,
      };

      await upsertBrand(updateData);

      notification = {
        type: "success",
        message: `Brand ${id === "add" ? "Added" : "Updated"}.`,
      };

      return { success: true, notification };

    case "delete":
      await deleteBrand(id as string);

      notification = {
        type: "warning",
        message: "Brand Deleted",
      };

      return { success: true, notification };
  }
};
