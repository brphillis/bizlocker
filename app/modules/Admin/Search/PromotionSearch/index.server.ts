import { json } from "@remix-run/node";
import { searchPromotions } from "~/models/Promotions/index.server";

export const promotionSearchLoader = async (request: Request) => {
  const url = new URL(request.url);

  const { promotions, totalPages } = await searchPromotions(undefined, url);

  return json({ promotions, totalPages });
};
