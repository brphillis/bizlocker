import { json } from "@remix-run/node";
import { searchStores } from "~/models/Stores/index.server";

export const storeSearchLoader = async (request: Request) => {
  const url = new URL(request.url);

  const { stores, totalPages } = await searchStores(undefined, url);

  return json({
    stores,
    totalPages,
  });
};
