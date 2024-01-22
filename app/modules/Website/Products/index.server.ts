import { Params } from "@remix-run/react";
import { addToCart } from "~/models/cart.server";
import { getBrands } from "~/models/brands.server";
import { json, type MetaFunction } from "@remix-run/node";
import { searchProducts } from "~/models/products.server";
import { getAvailableColors } from "~/models/enums.server";
import { getDepartments } from "~/models/departments.server";
import type { PromotionWithContent } from "~/models/promotions.server";
import { getProductCategories } from "~/models/productCategories.server";
import { getProductSubCategories } from "~/models/productSubCategories.server";
import {
  getRandomCampaignOrPromotion,
  type CampaignWithContent,
} from "~/models/campaigns.server";

export const meta: MetaFunction<typeof productsLoader> = ({ location }) => {
  const queries = location.search.replace("?", "&").split("&");

  const department = queries
    .find((e) => e.toLowerCase().includes("department"))
    ?.split("=")[1];
  const productCategory = queries
    .find((e) => e.toLowerCase().includes("productcategory"))
    ?.split("=")[1];
  const productSubCategory = queries
    .find((e) => e.toLowerCase().includes("productsubcategory"))
    ?.split("=")[1];

  const prioritizedMetaTitle =
    productSubCategory || productCategory || department || "Products";

  return [
    {
      title: `CLUTCH | ${prioritizedMetaTitle}`,
    },
    {
      name: `CLUTCH | ${prioritizedMetaTitle}`,
      description: `Shop the best in ${prioritizedMetaTitle} at CLUTCH, with store locations all over Australia we can provide next day shipping of our top quality ${prioritizedMetaTitle} straight to your door.`,
    },
  ];
};

export const productsLoader = async (
  request: Request,
  params: Params<string>,
) => {
  const url = new URL(request.url);
  const { products, totalPages } = await searchProducts(undefined, url, true);
  const departments = await getDepartments();
  const productCategories = await getProductCategories();
  const productSubCategories = await getProductSubCategories();
  const brands = await getBrands();
  const colors = await getAvailableColors();

  const productSubCategory = url.searchParams
    .get("productSubCategory")
    ?.toString();
  const { campaign, promotion } =
    ((await getRandomCampaignOrPromotion(productSubCategory)) as {
      campaign: CampaignWithContent;
      promotion: PromotionWithContent;
    }) || {};

  return json({
    campaign,
    promotion,
    products,
    totalPages,
    departments,
    productCategories,
    productSubCategories,
    brands,
    colors,
    url,
  });
};

export const productsAction = async (
  request: Request,
  params: Params<string>,
) => {
  const form = Object.fromEntries(await request.formData());
  const { variantId, quantity } = form;

  switch (form._action) {
    default:
      return await addToCart(request, variantId as string, quantity as string);
  }
};
