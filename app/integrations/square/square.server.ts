import { Client, Environment } from "square";
import { randomUUID } from "crypto";
import type {
  CreatePaymentLinkRequest,
  CreatePaymentLinkResponse,
  OrderLineItem,
} from "square";
import { prisma } from "~/db.server";

export const squareClient = new Client({
  environment: Environment.Sandbox, // Use Environment.Production when you're ready to go live
  accessToken: process.env.SQUARE_ACCESS,
});

export const CartItemsToSquareApiLineItems = (
  cartItems: CartItem[]
): OrderLineItem[] => {
  return cartItems.map((item: CartItem) => {
    const lineItem: OrderLineItem = {
      name: item.variant.product.name,
      quantity: item.quantity.toString(),
      basePriceMoney: {
        amount: BigInt(
          item.variant.isOnSale
            ? Math.round(item.variant.salePrice! * 100)
            : Math.round(item.variant.price * 100)
        ),
        currency: "AUD",
      },
    };

    return lineItem;
  });
};

export const createSquarePaymentLink = async (
  cartItems: CartItem[],
  userId: string
): Promise<{
  createPaymentLinkResponse: CreatePaymentLinkResponse;
  confirmCode: string;
}> => {
  const squareLineItems = CartItemsToSquareApiLineItems(cartItems);
  const confirmCode = randomUUID();

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      address: true,
      userDetails: true,
    },
  });
  const { email, address, userDetails } = user || {};

  // Create the Square API order request object
  const orderRequest: CreatePaymentLinkRequest = {
    idempotencyKey: randomUUID(),
    order: {
      locationId: "LB9PSX20NJ5X8",
      lineItems: squareLineItems,
    },
    checkoutOptions: {
      redirectUrl: `${process.env.DEV_URL}/order/payment-confirm/${confirmCode}`,
      askForShippingAddress: true,
      acceptedPaymentMethods: {
        applePay: true,
        googlePay: true,
      },
    },

    prePopulatedData: {
      buyerEmail: email,
      buyerPhoneNumber: userDetails?.phoneNumber,
      buyerAddress: {
        addressLine1: address?.addressLine1,
        addressLine2: address?.addressLine2,
        locality: address?.suburb,
        administrativeDistrictLevel1: address?.state,
        postalCode: address?.postcode,
        country: address?.country || undefined,
        firstName: userDetails?.firstName,
        lastName: userDetails?.lastName,
      },
    },
  };

  const { result } = (await squareClient.checkoutApi.createPaymentLink(
    orderRequest
  )) as any;

  const createPaymentLinkResponse = result;

  return { createPaymentLinkResponse, confirmCode };
};
