import { json } from "@remix-run/node";
import type { Staff } from "@prisma/client";
import type { Params } from "@remix-run/react";
import { getProductVariantStock } from "~/models/stock.server";
import { getUserDataFromSession, STAFF_SESSION_KEY } from "~/session.server";

export const productStockLoader = async (
  request: Request,
  params: Params<string>,
) => {
  let { searchParams } = new URL(request.url);
  let id = searchParams.get("contentId");

  if (!id) {
    throw new Response(null, {
      status: 404,
      statusText: "Stock Not Found",
    });
  }

  const stock = await getProductVariantStock(id);

  if (!stock) {
    throw new Response(null, {
      status: 404,
      statusText: "Stock Not Found",
    });
  }

  const { storeId } =
    ((await getUserDataFromSession(request, STAFF_SESSION_KEY)) as Staff) || {};

  return json({
    storeId,
    stock,
  });
};
