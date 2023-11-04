import type { CreatePaymentLinkResponse } from "square";
import { createSquarePaymentLink } from "~/integrations/square/square.server";

export const createPaymentLink_Integration = async (
  cartItems: CartItem[]
): Promise<{
  createPaymentLinkResponse: CreatePaymentLinkResponse;
  confirmCode: string;
}> => {
  return await createSquarePaymentLink(cartItems);
};
