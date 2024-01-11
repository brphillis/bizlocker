import type { Params } from "@remix-run/react";
import { json } from "@remix-run/server-runtime";
import { searchBrands } from "~/models/brands.server";

export const brandSearchLoader = async (
  request: Request,
  params: Params<string>,
) => {
  const url = new URL(request.url);

  const { brands, totalPages } = await searchBrands(undefined, url);

  return json({ brands, totalPages });
};
