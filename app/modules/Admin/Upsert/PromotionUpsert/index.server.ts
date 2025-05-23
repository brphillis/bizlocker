import { json } from "@remix-run/node";
import { Image } from "@prisma/client";
import { validateForm } from "~/utility/validate";
import { PageNotification } from "~/hooks/PageNotification";
import { getDepartments } from "~/models/Departments/index.server";
import { NewPromotion, PromotionWithContent } from "~/models/Promotions/types";
import {
  getPromotion,
  upsertPromotion,
} from "~/models/Promotions/index.server";

const validateOptions = {
  name: true,
  department: true,
  discountPercentage: true,
  bannerImage: true,
  tileImage: true,
};

export const promotionUpsertLoader = async (request: Request) => {
  const departments = await getDepartments();

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("contentId");

  if (!id) {
    throw new Response(null, {
      status: 404,
      statusText: "Promotion Not Found",
    });
  }

  const promotion =
    id === "add" ? ({} as PromotionWithContent) : await getPromotion(id);

  if (!promotion) {
    throw new Response(null, {
      status: 404,
      statusText: "Promotion Not Found",
    });
  }

  return json({ promotion, departments });
};

export const promotionUpsertAction = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const contentId = searchParams.get("contentId");
  const id = contentId === "add" || !contentId ? undefined : contentId;

  const { formEntries, formErrors } = validateForm(
    await request.formData(),
    validateOptions,
  );

  const {
    name,
    metaDescription,
    department,
    products,
    discountPercentage,
    gender,
    bannerImage,
    tileImage,
    isActive,
  } = formEntries;

  let notification: PageNotification;

  switch (formEntries._action) {
    case "upsert": {
      if (formErrors) {
        return json({ serverValidationErrors: formErrors });
      }

      const parsedBanner = JSON.parse(bannerImage?.toString()) as Image;

      const parsedTile = JSON.parse(tileImage?.toString()) as Image;

      const updateData: NewPromotion = {
        parsedBanner: parsedBanner,
        parsedTile: parsedTile,
        name: name as string,
        metaDescription: metaDescription as string,
        department: department as string,
        products: products && JSON.parse(products as string),
        discountPercentage: discountPercentage as string,
        gender: gender as string,
        isActive: isActive ? true : false,
        id: id,
      };

      await upsertPromotion(updateData);

      notification = {
        type: "success",
        message: `Promotion ${id === "add" ? "Added" : "Updated"}.`,
      };

      return json({ success: true, notification });
    }

    case "delete": {
      notification = {
        type: "warning",
        message: "Promotion Deleted",
      };

      return json({ success: true, notification });
    }
  }
};
