import { addToCart } from "~/models/Cart/index.server";
import { getBrands } from "~/models/Brands/index.server";
import { json, type MetaFunction } from "@remix-run/node";
import { searchProducts } from "~/models/Products/index.server";
import { getDepartments } from "~/models/Departments/index.server";
import { getProductCategories } from "~/models/ProductCategories/index.server";
import { getProductSubCategories } from "~/models/ProductSubCategories/index.server";
import { getRandomCampaignOrPromotion } from "~/models/Campaigns/index.server";
import { CampaignWithContent } from "~/models/Campaigns/types";
import { PromotionWithContent } from "~/models/Promotions/types";

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

export const productsLoader = async (request: Request) => {
  const url = new URL(request.url);
  const { products, totalPages } = await searchProducts(undefined, url, true);
  const departments = await getDepartments();
  const productCategories = await getProductCategories();
  const productSubCategories = await getProductSubCategories();
  const brands = await getBrands();

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
    url,
  });
};

export const productsAction = async (request: Request) => {
  const form = Object.fromEntries(await request.formData());
  const { variantId, quantity } = form;

  switch (form._action) {
    default:
      return await addToCart(request, variantId as string, quantity as string);
  }
};
