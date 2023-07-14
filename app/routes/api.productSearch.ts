import { type LoaderArgs, json } from "@remix-run/node";
import { productSearchFormData } from "~/utility/actionHelpers";

export const loader = async ({ request }: LoaderArgs) => {
  const url = new URL(request.url);
  const searchParams = url.searchParams;

  const formData: { [key: string]: FormDataEntryValue } = {};
  searchParams.forEach((value, key) => {
    formData[key] = value;
  });

  const products = await productSearchFormData(formData);
  return json(products);
};
