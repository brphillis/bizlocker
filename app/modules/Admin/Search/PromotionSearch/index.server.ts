import type { Params } from "@remix-run/react";
import { json } from "@remix-run/node";
import { searchPromotions } from "~/models/promotions.server";

export const promotionSearchLoader = async (
  request: Request,
  params: Params<string>,
) => {
  const url = new URL(request.url);

  const { promotions, totalPages } = await searchPromotions(undefined, url);

  return json({ promotions, totalPages });
};
