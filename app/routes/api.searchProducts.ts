import { type LoaderFunctionArgs, json } from "@remix-run/node";
import { searchProducts } from "~/models/Products/index.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const searchParams = url.searchParams;

  const formData: { [key: string]: FormDataEntryValue } = {};
  searchParams.forEach((value, key) => {
    formData[key] = value;
  });

  const products = await searchProducts(formData);
  return json(products);
};
