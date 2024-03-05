import { Client, Environment } from "square";
import { randomUUID } from "crypto";
import type {
  CreatePaymentLinkRequest,
  CreatePaymentLinkResponse,
  OrderLineItem,
} from "square";
import { CartItemWithDetails } from "~/models/Cart/types";
import { Address } from "@prisma/client";
import { AddressToSquareAddress } from "~/helpers/addressHelpers";

export const squareClient = new Client({
  environment:
    process.env.NODE_ENV === "development"
      ? Environment.Sandbox
      : Environment.Production,
  accessToken: process.env.SQUARE_ACCESS,
});
export const squareLocationId =
  process.env.NODE_ENV === "development" ? "LB9PSX20NJ5X8" : "LTMN9Y79GKP80";
export const CartItemsToSquareApiLineItems = (
  cartItems: CartItemWithDetails[],
): OrderLineItem[] => {
  return cartItems.map((item: CartItemWithDetails) => {
    const lineItem: OrderLineItem = {
      name: item?.variant?.product?.name,
      quantity: item.quantity.toString(),
      basePriceMoney: {
        amount: BigInt(
          item?.variant?.isOnSale
            ? Math.round(item.variant.salePrice! * 100)
            : Math.round(item.variant!.price * 100),
        ),
        currency: "AUD",
      },
    };

    return lineItem;
  });
};

export const createSquarePaymentLink = async (
  cartItems: CartItemWithDetails[],
  shippingPrice: bigint,
  address: Address,
  firstName: string,
  lastName: string,
  email: string,
  phoneNumber: string,
): Promise<{
  createPaymentLinkResponse: CreatePaymentLinkResponse;
  confirmCode: string;
}> => {
  const squareLineItems = CartItemsToSquareApiLineItems(cartItems);

  const confirmCode = randomUUID();

  // Create the Square API order request object
  const orderRequest: CreatePaymentLinkRequest = {
    idempotencyKey: randomUUID(),
    order: {
      locationId: squareLocationId,
      lineItems: squareLineItems,
    },
    checkoutOptions: {
      redirectUrl: `${process.env.SITE_URL}/payment-confirm/${confirmCode}`,
      acceptedPaymentMethods: {
        applePay: true,
        googlePay: true,
      },
      shippingFee: {
        name: "shipping fee",
        charge: {
          amount: shippingPrice,
          currency: "AUD",
        },
      },
    },
    prePopulatedData: {
      buyerAddress: AddressToSquareAddress(address, firstName, lastName),
      buyerEmail: email,
      buyerPhoneNumber: phoneNumber,
    },
  };

  const { result } =
    await squareClient.checkoutApi.createPaymentLink(orderRequest);

  const createPaymentLinkResponse = result;

  return { createPaymentLinkResponse, confirmCode };
};
