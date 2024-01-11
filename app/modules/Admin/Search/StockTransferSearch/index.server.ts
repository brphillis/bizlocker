import type { Params } from "@remix-run/react";
import { getStores } from "~/models/stores.server";
import { json } from "@remix-run/node";
import { searchStockTransfers } from "~/models/stock.server";

export const stockTransferSearchLoader = async (
  request: Request,
  params: Params<string>,
) => {
  const url = new URL(request.url);

  const { stockTransfers, totalPages } = await searchStockTransfers(
    undefined,
    url,
  );

  const stores = await getStores();

  return json({
    stockTransfers,
    totalPages,
    stores,
  });
};
