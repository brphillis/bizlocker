import { addToCart } from "~/models/Cart/index.server";
import { getBrands } from "~/models/Brands/index.server";
import { json } from "@remix-run/node";
import { searchProducts } from "~/models/Products/index.server";
import { getDepartments } from "~/models/Departments/index.server";
import { getProductCategories } from "~/models/ProductCategories/index.server";
import { getProductSubCategories } from "~/models/ProductSubCategories/index.server";
import { getRandomPromotionBanner } from "~/models/Promotions/index.server";

export const productsLoader = async (request: Request) => {
  const url = new URL(request.url);
  const { products, totalPages, count } = await searchProducts(
    undefined,
    url,
    true,
  );
  const departments = await getDepartments();
  const productCategories = await getProductCategories();
  const productSubCategories = await getProductSubCategories();
  const brands = await getBrands();

  const promotion = await getRandomPromotionBanner();

  const meta = {
    title: "CLUTCH | Product Search",
    description:
      "Discover timeless style and effortless sophistication with Clutch Clothing Australia. Elevate your wardrobe with our curated collection of premium apparel, designed for the modern Australian lifestyle. Explore our range today and experience fashion that's as versatile as you are.",
  };

  return json({
    brands,
    count,
    departments,
    meta,
    productCategories,
    products,
    productSubCategories,
    promotion,
    totalPages,
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
