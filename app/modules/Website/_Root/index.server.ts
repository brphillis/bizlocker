import { User } from "@prisma/client";
import { getCart } from "~/models/Cart/index.server";
import { json } from "@remix-run/node";
import { getBrands } from "~/models/Brands/index.server";
import { getUserDataFromSession } from "~/session.server";
import { getDepartments } from "~/models/Departments/index.server";
import { getSiteSettings } from "~/models/SiteSettings/index.server";
import { GetRandomActivePromotions } from "~/models/Promotions/index.server";
import { getProductCategories } from "~/models/ProductCategories/index.server";

export const websiteRootLoader = async (request: Request) => {
  const user = (await getUserDataFromSession(request)) as User | null;
  const cart = await getCart(request);

  const departments = await getDepartments();
  const brands = await getBrands();
  const productCategories = await getProductCategories();
  const siteSettings = await getSiteSettings();

  const navigationPromotions = await GetRandomActivePromotions(2, true);

  const meta = {
    title: "CLUTCH | Clothing",
    description:
      "Discover timeless style and effortless sophistication with Clutch Clothing Australia. Elevate your wardrobe with our curated collection of premium apparel, designed for the modern Australian lifestyle. Explore our range today and experience fashion that's as versatile as you are.",
  };

  return json({
    meta,
    user,
    cart,
    departments,
    productCategories,
    brands,
    navigationPromotions,
    siteSettings,
  });
};
