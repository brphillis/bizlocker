import { Client, Environment } from "square";
import { randomUUID } from "crypto";
import type {
  CreatePaymentLinkRequest,
  CreatePaymentLinkResponse,
  OrderLineItem,
} from "square";
import { prisma } from "~/db.server";
import { AddressToSquareAddress } from "~/helpers/addressHelpers";

export const squareClient = new Client({
  environment: Environment.Sandbox, // Use Environment.Production when you're ready to go live
  accessToken: process.env.SQUARE_ACCESS,
});

export const squareLocationId = "LB9PSX20NJ5X8";

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
  userId?: string
): Promise<{
  createPaymentLinkResponse: CreatePaymentLinkResponse;
  confirmCode: string;
}> => {
  const squareLineItems = CartItemsToSquareApiLineItems(cartItems);
  const confirmCode = randomUUID();
  let user = undefined;

  if (userId) {
    user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        address: true,
        userDetails: true,
      },
    });
  }

  const { email, address, userDetails } = user || {};
  const squareAddress = AddressToSquareAddress(address as Address);

  // Create the Square API order request object
  let orderRequest: CreatePaymentLinkRequest = {
    idempotencyKey: randomUUID(),
    order: {
      locationId: squareLocationId,
      lineItems: squareLineItems,
    },
    checkoutOptions: {
      redirectUrl: `${process.env.SITE_URL}/order/payment-confirm/${confirmCode}`,
      askForShippingAddress: true,
      acceptedPaymentMethods: {
        applePay: true,
        googlePay: true,
      },
    },
  };

  if (squareAddress || userDetails?.firstName || userDetails?.lastName) {
    orderRequest.prePopulatedData = {};
    orderRequest.prePopulatedData.buyerAddress = {};
  }

  if (email || userDetails?.phoneNumber) {
    orderRequest.prePopulatedData = {};
  }

  if (squareAddress) {
    orderRequest.prePopulatedData!.buyerAddress = {
      ...squareAddress,
    };
  }

  if (userDetails) {
    if (userDetails.firstName) {
      orderRequest.prePopulatedData!.buyerAddress!.firstName =
        userDetails?.firstName;
    }
    if (userDetails.lastName) {
      orderRequest.prePopulatedData!.buyerAddress!.lastName =
        userDetails?.lastName;
    }
  }

  if (email) {
    orderRequest.prePopulatedData!.buyerEmail = email;
  }

  if (userDetails?.phoneNumber) {
    orderRequest.prePopulatedData!.buyerPhoneNumber = userDetails.phoneNumber;
  }

  const { result } = (await squareClient.checkoutApi.createPaymentLink(
    orderRequest
  )) as any;

  const createPaymentLinkResponse = result;

  return { createPaymentLinkResponse, confirmCode };
};
