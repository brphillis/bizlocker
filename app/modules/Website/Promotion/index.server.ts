import { Params } from "@remix-run/react";
import { addToCart } from "~/models/cart.server";
import { getBrands } from "~/models/brands.server";
import { searchProducts } from "~/models/products.server";
import { getPromotion } from "~/models/promotions.server";
import { getAvailableColors } from "~/models/enums.server";
import { getDepartments } from "~/models/departments.server";
import { json, redirect, type MetaFunction } from "@remix-run/node";
import { getProductCategories } from "~/models/productCategories.server";
import { getProductSubCategories } from "~/models/productSubCategories.server";

export const meta: MetaFunction<typeof promotionLoader> = ({ data }: any) => {
  return [
    { title: data?.promotion.name },
    {
      name: data?.promotion.name,
      content: data?.promotion.metaDescription,
    },
  ];
};

export const promotionLoader = async (
  request: Request,
  params: Params<string>,
) => {
  const url = new URL(request.url);
  const promotion = await getPromotion(undefined, params.pagel2);

  if (!promotion) {
    return redirect(request?.referrer);
  }

  const formData = new FormData();
  formData.set("promotionId", promotion.id.toString());

  const { products, totalPages } = await searchProducts(
    Object.fromEntries(formData),
    url,
    true,
  );

  if (!promotion?.isActive) {
    return redirect(request?.referrer);
  }

  const departments = await getDepartments();
  const productCategories = await getProductCategories();
  const productSubCategories = await getProductSubCategories();
  const brands = await getBrands();
  const colors = await getAvailableColors();

  return json({
    promotion,
    products,
    totalPages,
    departments,
    productCategories,
    productSubCategories,
    brands,
    colors,
  });
};

export const promotionAction = async (
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
