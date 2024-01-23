import { getStores } from "~/models/Stores/index.server";
import { json } from "@remix-run/node";
import { searchStockTransfers } from "~/models/Stock/index.server";

export const stockTransferSearchLoader = async (request: Request) => {
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
