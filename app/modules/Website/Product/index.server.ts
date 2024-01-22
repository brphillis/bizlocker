import { Params } from "@remix-run/react";
import { json, type MetaFunction } from "@remix-run/node";
import { getProduct, searchProducts } from "~/models/products.server";
import { getBrand } from "~/models/brands.server";

export const meta: MetaFunction<typeof productLoader> = ({ data }: any) => {
  return [
    {
      title: `CLUTCH | ${data?.product.name}`,
    },
    {
      name: `CLUTCH | ${data?.product.name}`,
      description: `${data?.product.name} available now at CLUTCH, with store locations all over Australia we can provide next day shipping of our top quality ${data?.product.name} straight to your door.`,
    },
  ];
};

export const productLoader = async (
  request: Request,
  params: Params<string>,
) => {
  const url = new URL(request.url);
  const productId = url.searchParams.get("id");

  if (!productId) {
    throw new Response(null, {
      status: 404,
      statusText: "Product Not Found",
    });
  }

  const product = await getProduct(productId);

  if (!product) {
    throw new Response(null, {
      status: 404,
      statusText: "Product Not Found",
    });
  }

  const { brandId } = product || {};

  let brand;

  if (brandId) {
    brand = await getBrand(brandId.toString());
  }

  // get recommended products
  const recommendCategory =
    product?.productSubCategories?.[0].productCategory?.name;
  const recommendGender = product?.gender;

  const formData = new FormData();

  formData.set("excludeId", productId);
  formData.set("isActive", "true");
  formData.set("perPage", "5");

  recommendCategory && formData.set("productCategory", recommendCategory);
  recommendGender && formData.set("gender", recommendGender);

  const { products: similarProducts } = await searchProducts(
    Object.fromEntries(formData),
    undefined,
    true,
  );

  return json({ product, brand, similarProducts });
};
