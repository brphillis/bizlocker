import { json } from "@remix-run/node";
import { getOrdersCurrentUser } from "~/models/Orders/index.server";

export const accountOrdersLoader = async (request: Request) => {
  const orders = await getOrdersCurrentUser(request);

  const meta = {
    title: "CLUTCH | Orders",
    description:
      "Discover timeless style and effortless sophistication with Clutch Clothing Australia. Elevate your wardrobe with our curated collection of premium apparel, designed for the modern Australian lifestyle. Explore our range today and experience fashion that's as versatile as you are.",
  };

  return json({ meta, orders });
};
