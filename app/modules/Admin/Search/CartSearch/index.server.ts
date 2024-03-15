import { json } from "@remix-run/server-runtime";
import { searchCarts } from "~/models/Cart/index.server";

export const cartSearchLoader = async (request: Request) => {
  const url = new URL(request.url);

  const { carts, totalPages } = await searchCarts(undefined, url);

  return json({ carts, totalPages });
};
