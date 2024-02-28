import type { CartItem } from "@prisma/client";
import type { CreatePaymentLinkResponse } from "square";
import { createSquarePaymentLink } from "~/integrations/square/square.server";

export const createPaymentLink_Integration = async (
  cartItems: CartItem[],
  shippingFee: bigint,
): Promise<{
  createPaymentLinkResponse: CreatePaymentLinkResponse;
  confirmCode: string;
}> => {
  return await createSquarePaymentLink(cartItems, shippingFee);
};
