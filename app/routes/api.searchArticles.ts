import { type LoaderFunctionArgs, json } from "@remix-run/node";
import { searchArticles } from "~/models/Articles/index.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const searchParams = url.searchParams;

  const formData: { [key: string]: FormDataEntryValue } = {};
  searchParams.forEach((value, key) => {
    formData[key] = value;
  });

  const products = await searchArticles(formData);
  return json(products);
};
