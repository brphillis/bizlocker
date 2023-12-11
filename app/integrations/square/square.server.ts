import { Client, Environment } from "square";
import { randomUUID } from "crypto";
import type { CartItemWithDetails } from "~/models/cart.server";
import type {
  CreatePaymentLinkRequest,
  CreatePaymentLinkResponse,
  OrderLineItem,
} from "square";

export const squareClient = new Client({
  environment: Environment.Sandbox, // Use Environment.Production when you're ready to go live
  accessToken: process.env.SQUARE_ACCESS,
});

export const squareLocationId = "LB9PSX20NJ5X8";

export const CartItemsToSquareApiLineItems = (
  cartItems: CartItemWithDetails[]
): OrderLineItem[] => {
  return cartItems.map((item: CartItemWithDetails) => {
    const lineItem: OrderLineItem = {
      name: item?.variant?.product?.name,
      quantity: item.quantity.toString(),
      basePriceMoney: {
        amount: BigInt(
          item?.variant?.isOnSale
            ? Math.round(item.variant.salePrice! * 100)
            : Math.round(item.variant!.price * 100)
        ),
        currency: "AUD",
      },
    };

    return lineItem;
  });
};

export const createSquarePaymentLink = async (
  cartItems: CartItemWithDetails[]
): Promise<{
  createPaymentLinkResponse: CreatePaymentLinkResponse;
  confirmCode: string;
}> => {
  const squareLineItems = CartItemsToSquareApiLineItems(cartItems);

  const confirmCode = randomUUID();

  // Create the Square API order request object
  let orderRequest: CreatePaymentLinkRequest = {
    idempotencyKey: randomUUID(),
    order: {
      locationId: squareLocationId,
      lineItems: squareLineItems,
    },
    checkoutOptions: {
      redirectUrl: `${process.env.SITE_URL}/order/payment-confirm/${confirmCode}`,
      askForShippingAddress: false,
      acceptedPaymentMethods: {
        applePay: true,
        googlePay: true,
      },
    },
  };

  const { result } = (await squareClient.checkoutApi.createPaymentLink(
    orderRequest
  )) as any;

  const createPaymentLinkResponse = result;

  return { createPaymentLinkResponse, confirmCode };
};
