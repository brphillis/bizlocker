import { Params } from "@remix-run/react";
import { json, type MetaFunction } from "@remix-run/node";
import { getOrdersCurrentUser } from "~/models/orders.server";

export const meta: MetaFunction<typeof accountOrdersLoader> = ({ data }) => {
  return [
    { title: "CLUTCH | Your Orders" },
    {
      name: "CLUTCH | Your Orders",
      content: "CLUTCH | Your Orders",
    },
  ];
};

export const accountOrdersLoader = async (
  request: Request,
  params: Params<string>,
) => {
  const orders = await getOrdersCurrentUser(request);
  return json(orders);
};
