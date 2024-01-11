import type { Params } from "@remix-run/react";
import { json } from "@remix-run/node";
import { searchStores } from "~/models/stores.server";

export const storeSearchLoader = async (
  request: Request,
  params: Params<string>,
) => {
  const url = new URL(request.url);

  const { stores, totalPages } = await searchStores(undefined, url);

  return json({
    stores,
    totalPages,
  });
};
