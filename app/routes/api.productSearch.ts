import { type LoaderArgs, json } from "@remix-run/node";
import { productSearchFormData } from "~/utility/actionHelpers";

export const loader = async ({ request }: LoaderArgs) => {
  const products = await productSearchFormData();
  return json(products);
};
