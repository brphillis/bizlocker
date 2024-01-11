import type { Params } from "@remix-run/react";
import { searchOrders } from "~/models/orders.server";
import { json } from "@remix-run/node";

export const orderSearchLoader = async (
  request: Request,
  params: Params<string>,
) => {
  const url = new URL(request.url);

  const searchQuery = {
    id: url.searchParams.get("id")?.toString() || undefined,
    status: url.searchParams.get("status")?.toString() || undefined,
    email: url.searchParams.get("email")?.toString() || undefined,
    page: Number(url.searchParams.get("pageNumber")) || 1,
    perPage: Number(url.searchParams.get("perPage")) || 10,
  };

  const { orders, totalPages } = await searchOrders(searchQuery);

  return json({ orders, totalPages });
};
