import type { Address, CartItem } from "@prisma/client";
import type { CreatePaymentLinkResponse } from "square";
import { createSquarePaymentLink } from "~/integrations/square/square.server";

export const createPaymentLink_Integration = async (
  cartItems: CartItem[],
  shippingFee: bigint,
  address: Address,
  firstName: string,
  lastName: string,
  email: string,
  phoneNumber: string,
): Promise<{
  createPaymentLinkResponse: CreatePaymentLinkResponse;
  confirmCode: string;
}> => {
  return await createSquarePaymentLink(
    cartItems,
    shippingFee,
    address,
    firstName,
    lastName,
    email,
    phoneNumber,
  );
};
