import { Params } from "@remix-run/react";
import { addToCart } from "~/models/Cart/index.server";
import { getBrands } from "~/models/Brands/index.server";
import { searchProducts } from "~/models/Products/index.server";
import { getPromotion } from "~/models/Promotions/index.server";
import { getAvailableColors } from "~/models/enums.server";
import { getDepartments } from "~/models/Departments/index.server";
import { json, type MetaFunction } from "@remix-run/node";
import { getProductCategories } from "~/models/ProductCategories/index.server";
import { getProductSubCategories } from "~/models/ProductSubCategories/index.server";

export const meta: MetaFunction<typeof promotionLoader> = ({ data }) => {
  const loaderData = data as MetaType;

  return [
    { title: loaderData?.promotion.name },
    {
      name: loaderData?.promotion.name,
      content: loaderData?.promotion.metaDescription,
    },
  ];
};

export const promotionLoader = async (
  request: Request,
  params: Params<string>,
) => {
  const url = new URL(request.url);

  const promotion = await getPromotion(undefined, params.pagel2);

  if (!promotion || (promotion && !promotion.isActive)) {
    throw new Response(null, {
      status: 404,
      statusText: "Page Not Found",
    });
  }

  const formData = new FormData();
  formData.set("promotionId", promotion.id.toString());

  const { products, totalPages } = await searchProducts(
    Object.fromEntries(formData),
    url,
    true,
  );

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

export const promotionAction = async (request: Request) => {
  const form = Object.fromEntries(await request.formData());
  const { variantId, quantity } = form;
  switch (form._action) {
    default:
      return await addToCart(request, variantId as string, quantity as string);
  }
};
