import { Image } from "@prisma/client";
import { Params } from "@remix-run/react";
import { json } from "@remix-run/node";
import { validateForm } from "~/utility/validate";
import { getBrands } from "~/models/Brands/index.server";
import { getDepartments } from "~/models/Departments/index.server";
import { PageNotification } from "~/hooks/PageNotification";
import { getProductSubCategories } from "~/models/ProductSubCategories/index.server";
import { getCampaign, upsertCampaign } from "~/models/Campaigns/index.server";
import { CampaignWithContent, NewCampaign } from "~/models/Campaigns/types";

const validateOptions = {
  name: true,
  department: true,
  productSubCategories: true,
  brands: true,
  minSaleRange: true,
  maxSaleRange: true,
  bannerImage: true,
  tileImage: true,
};

export const campaignUpsertLoader = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("contentId");

  if (!id) {
    throw new Response(null, {
      status: 404,
      statusText: "Campaign Not Found",
    });
  }

  const departments = await getDepartments();
  const productSubCategories = await getProductSubCategories();
  const brands = await getBrands();

  if (!departments || !productSubCategories || !brands) {
    throw new Response(null, {
      status: 404,
      statusText: "Error Retrieving Supporting Resources",
    });
  }

  const campaign =
    id === "add" ? ({} as CampaignWithContent) : await getCampaign(id);

  if (!campaign) {
    throw new Response(null, {
      status: 404,
      statusText: "Campaign Not Found",
    });
  }

  return json({ campaign, departments, productSubCategories, brands });
};

export const campaignUpsertAction = async (
  request: Request,
  params: Params<string>,
) => {
  const id = params.id === "add" ? undefined : params.id;

  const { formEntries, formErrors } = validateForm(
    await request.formData(),
    validateOptions,
  );

  const {
    name,
    department,
    productSubCategories,
    brands,
    minSaleRange,
    maxSaleRange,
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

      const parsedBanner = bannerImage
        ? (JSON.parse(bannerImage?.toString()) as Image)
        : undefined;

      const parsedTile = tileImage
        ? (JSON.parse(tileImage?.toString()) as Image)
        : undefined;

      const updateData: NewCampaign = {
        name: name as string,
        department: department as string,
        productSubCategories:
          productSubCategories && JSON.parse(productSubCategories as string),
        brands: brands && JSON.parse(brands as string),
        minSaleRange: minSaleRange as string,
        maxSaleRange: maxSaleRange as string,
        gender: gender as string,
        parsedBanner: parsedBanner as Image,
        parsedTile: parsedTile as Image,
        isActive: isActive ? true : false,
        id: id,
      };

      await upsertCampaign(updateData);

      notification = {
        type: "success",
        message: `Campaign ${id === "add" ? "Added" : "Updated"}.`,
      };

      return json({ success: true, notification });
    }

    case "delete": {
      notification = {
        type: "warning",
        message: "Campaign Deleted",
      };

      return json({ success: true, notification });
    }
  }
};
