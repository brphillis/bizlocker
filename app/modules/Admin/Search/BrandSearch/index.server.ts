import { json } from "@remix-run/server-runtime";
import { searchBrands } from "~/models/Brands/index.server";

export const brandSearchLoader = async (request: Request) => {
  const url = new URL(request.url);

  const { brands, totalPages } = await searchBrands(undefined, url);

  return json({ brands, totalPages });
};
