import { json } from "@remix-run/node";
import { Image } from "@prisma/client";
import { validateForm } from "~/utility/validate";
import type { PageNotification } from "~/hooks/PageNotification";
import { BrandWithContent, NewBrand } from "~/models/Brands/types";
import {
  deleteBrand,
  getBrand,
  upsertBrand,
} from "~/models/Brands/index.server";

const validateOptions = {
  name: true,
};

export const brandUpsertLoader = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("contentId");

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

export const brandUpsertAction = async (request: Request) => {
  let notification: PageNotification;

  const { searchParams } = new URL(request.url);
  const contentId = searchParams.get("contentId");
  const id = contentId === "add" || !contentId ? undefined : contentId;

  const { formEntries, formErrors } = validateForm(
    await request.formData(),
    validateOptions,
  );

  const { name, image, isActive } = formEntries;

  switch (formEntries._action) {
    case "upsert": {
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
    }

    case "delete": {
      await deleteBrand(id as string);

      notification = {
        type: "warning",
        message: "Brand Deleted",
      };

      return { success: true, notification };
    }
  }
};
