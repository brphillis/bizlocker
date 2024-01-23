import { json, type MetaFunction } from "@remix-run/node";
import { getOrdersCurrentUser } from "~/models/Orders/index.server";

export const meta: MetaFunction<typeof accountOrdersLoader> = () => {
  return [
    { title: "CLUTCH | Your Orders" },
    {
      name: "CLUTCH | Your Orders",
      content: "CLUTCH | Your Orders",
    },
  ];
};

export const accountOrdersLoader = async (request: Request) => {
  const orders = await getOrdersCurrentUser(request);
  return json(orders);
};
