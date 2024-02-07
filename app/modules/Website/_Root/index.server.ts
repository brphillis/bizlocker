import { User } from "@prisma/client";
import { getCart } from "~/models/Cart/index.server";
import { json, MetaFunction } from "@remix-run/node";
import { getBrands } from "~/models/Brands/index.server";
import { getUserDataFromSession } from "~/session.server";
import { getDepartments } from "~/models/Departments/index.server";
import { getSiteSettings } from "~/models/SiteSettings/index.server";
import { GetRandomActivePromotions } from "~/models/Promotions/index.server";
import { getProductCategories } from "~/models/ProductCategories/index.server";

export const meta: MetaFunction = () => {
  return [
    { title: "CLUTCH Clothing" },
    {
      name: "CLUTCH Clothing",
      content: "CLUTCH Clothing",
    },
  ];
};

export const websiteRootLoader = async (request: Request) => {
  const user = (await getUserDataFromSession(request)) as User | null;
  const cart = await getCart(request);

  const departments = await getDepartments();
  const brands = await getBrands();
  const productCategories = await getProductCategories();
  const siteSettings = await getSiteSettings();

  const navigationPromotions = await GetRandomActivePromotions(2, true);

  return json({
    user,
    cart,
    departments,
    productCategories,
    brands,
    navigationPromotions,
    siteSettings,
  });
};
