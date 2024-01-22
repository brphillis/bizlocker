import { Params } from "@remix-run/react";
import type { MetaFunction } from "@remix-run/node";
import { confirmPayment } from "~/models/orders.server";

export const meta: MetaFunction = ({ data }: any) => {
  return [
    { title: "CLUTCH | Confirm Payment" },
    {
      name: "CLUTCH | Confirm Payment",
      content: "CLUTCH | Confirm Payment",
    },
  ];
};

export const paymentConfirmLoader = async (
  request: Request,
  params: Params<string>,
) => {
  const paymentCode = params.pagel2;
  if (paymentCode) {
    const order = await confirmPayment(paymentCode);
    return order;
  } else return null;
  //TODO 001 - ADD REDIRECT PAGE WHEN ORDER CANT BE FOUND
};
