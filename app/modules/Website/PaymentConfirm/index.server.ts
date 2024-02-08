import { Params } from "@remix-run/react";
import { confirmPayment } from "~/models/Orders/index.server";

export const paymentConfirmLoader = async (
  request: Request,
  params: Params<string>,
) => {
  const paymentCode = params.pagel2;
  if (paymentCode) {
    const order = await confirmPayment(paymentCode);

    const meta = {
      title: "CLUTCH | Confirm Payment",
      description:
        "Discover timeless style and effortless sophistication with Clutch Clothing Australia. Elevate your wardrobe with our curated collection of premium apparel, designed for the modern Australian lifestyle. Explore our range today and experience fashion that's as versatile as you are.",
    };

    return { meta, order };
  } else return null;
  //TODO 001 - ADD REDIRECT PAGE WHEN ORDER CANT BE FOUND
};
