import { prisma } from "~/db.server";
import { redirect } from "@remix-run/server-runtime";
import { SquareAddressToAddress } from "~/helpers/addressHelpers";
import { squareClient } from "~/integrations/square/square.server";
import {
  getSession,
  getUserDataFromSession,
  sessionStorage,
  USER_SESSION_KEY,
} from "~/session.server";
import { getCart } from "./cart.server";
import { getVariantUnitPrice } from "~/helpers/numberHelpers";
import { sendOrderReceiptEmail } from "~/integrations/sendgrid/emails/orderReceipt";
import { createPaymentLink_Integration } from "~/integrations/_master/payments";

export const getOrder = async (orderId: string) => {
  return await prisma.order.findUnique({
    where: {
      orderId: orderId,
    },
    include: {
      items: {
        include: {
          variant: {
            include: {
              product: true,
            },
          },
        },
      },
      address: true,
      user: true,
    },
  });
};

export const getOrdersCurrentUser = async (request: Request) => {
  const userData = (await getUserDataFromSession(request)) as User;
  const userId = userData?.id;

  return await prisma.order.findMany({
    where: {
      userId: userId,
    },
    include: {
      address: true,
      items: {
        include: {
          variant: {
            include: {
              product: true,
            },
          },
        },
      },
      user: true,
    },
  });
};

export const getSquareOrderDetails = async (
  orderId: string
): Promise<{ shippingDetails: SquareShippingDetails; email: string }> => {
  const response = await squareClient.ordersApi.retrieveOrder(orderId);

  const shippingDetails = response?.result?.order?.fulfillments?.find(
    (fulfillment) => fulfillment.type === "SHIPMENT"
  )?.shipmentDetails?.recipient?.address as SquareShippingDetails;

  const email = response?.result?.order?.fulfillments?.find(
    (fulfillment) => fulfillment.type === "SHIPMENT"
  )?.shipmentDetails?.recipient?.emailAddress as string;

  return { shippingDetails, email };
};

export const createOrder = async (
  request: Request,
  firstName: string,
  lastName: string,
  address: Address,
  shippingMethod: string,
  shippingPrice: string,
  rememberInformation: boolean
) => {
  const userData = (await getUserDataFromSession(request)) as User;
  const cart = await getCart(request);

  if (!cart) {
    throw new Error("Cart not found");
  }

  const cartItems = cart?.cartItems as unknown as CartItem[];
  const userId = userData?.id || undefined;

  const { createPaymentLinkResponse, confirmCode } =
    await createPaymentLink_Integration(cartItems);

  if (createPaymentLinkResponse && createPaymentLinkResponse.paymentLink) {
    const { paymentLink } = createPaymentLinkResponse;

    const orderItems: NewOrderItem[] = [];
    let totalPrice = 0;

    //create the order object
    for (const { variantId, variant, quantity } of cartItems) {
      const itemTotalPrice = parseInt(
        getVariantUnitPrice(variant, undefined, variant?.product?.promotion)
      );

      if (itemTotalPrice) {
        totalPrice += itemTotalPrice * quantity;

        orderItems.push({
          variantId,
          quantity,
          unitPrice: Math.round(itemTotalPrice),
        });
      }
    }

    await prisma.order.create({
      data: {
        orderId: paymentLink.orderId,
        status: "created",
        rememberInformation: rememberInformation,
        paymentCode: confirmCode,
        totalPrice: totalPrice,
        paymentUrl: paymentLink.url!,
        paymentLinkId: paymentLink.id!,
        shippingMethod: shippingMethod,
        shippingPrice: shippingPrice,
        firstName: firstName,
        lastName: lastName,
        address: {
          create: {
            addressLine1: address.addressLine1,
            addressLine2: address.addressLine2,
            suburb: address.suburb,
            state: address.state,
            postcode: address.postcode,
            country: address.country,
          },
        },
        user: userId
          ? {
              connect: {
                id: userId,
              },
            }
          : undefined,
        items: {
          createMany: {
            data: orderItems,
          },
        },
      },
    });

    //order is successful, delete the cart
    await prisma.cartItem.deleteMany({
      where: {
        cartId: cart.id,
      },
    });

    await prisma.cart.delete({
      where: {
        id: cart.id,
      },
    });

    //remove the cart from current user cookie
    const userNoCart = {
      ...userData,
      cart: null,
    };

    const session = await getSession(request);
    session.set(USER_SESSION_KEY, userNoCart);

    return redirect(createPaymentLinkResponse.paymentLink.longUrl!, {
      headers: {
        "Set-Cookie": await sessionStorage.commitSession(session),
      },
    });
  }

  throw new Error("the order could not be generated");
};

export const confirmPayment = async (paymentCode: string) => {
  // Find the order based on the payment code
  const order = await prisma.order.findFirst({
    where: {
      paymentCode,
    },
    include: {
      address: true,
      items: {
        include: {
          variant: {
            include: {
              product: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      },
      user: true,
    },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  // Update the order status to "paid"
  const updatedOrder = await prisma.order.update({
    where: {
      orderId: order.orderId,
    },
    data: {
      status: "paid",
    },
    include: {
      items: {
        include: {
          variant: {
            include: {
              product: true,
            },
          },
        },
      },
    },
  });

  // Go through each item in the order and decrement the stock of the associated variant
  // And then increase the totalSold amount on the variant and total for the product
  for (const item of order.items) {
    await prisma.productVariant.update({
      where: {
        id: item.variantId,
      },
      data: {
        stock: {
          decrement: item.quantity,
        },
        totalSold: {
          increment: item.quantity,
        },
        product: {
          update: {
            totalSold: {
              increment: item.quantity,
            },
          },
        },
      },
    });
  }

  const { email, shippingDetails } =
    (await getSquareOrderDetails(order.orderId)) || {};

  // handling upserting user data
  if (order.rememberInformation && order.userId) {
    const address = SquareAddressToAddress(shippingDetails);

    await prisma.address.upsert({
      where: {
        userId: order.userId,
      },
      create: {
        ...address,
        user: { connect: { id: order.userId } },
      },
      update: {
        ...address,
        user: { connect: { id: order.userId } },
      },
    });
  }

  await sendOrderReceiptEmail(email, order as unknown as Order);

  return updatedOrder;
};

export const updateOrderStatus = async (
  orderId: string,
  updatedStatus: OrderStatus
) => {
  return await prisma.order.update({
    where: {
      orderId: orderId,
    },
    data: {
      status: updatedStatus,
    },
  });
};

export const updateOrderShippingDetails = async (
  orderId: string,
  firstName: string,
  lastName: string,
  addressLine1: string,
  addressLine2: string,
  suburb: string,
  state: string,
  postcode: string,
  country: string
) => {
  return await prisma.order.update({
    where: { orderId: orderId },
    data: {
      firstName,
      lastName,
      address: {
        update: {
          addressLine1,
          addressLine2,
          suburb,
          state,
          postcode,
          country,
        },
      },
    },
  });
};

export const searchOrders = async (searchArgs: BasicSearchArgs) => {
  const {
    id,
    status,
    email,
    startDate,
    endDate,
    page = 1,
    perPage = 10,
  } = searchArgs;

  const skip = (page - 1) * perPage;
  const take = perPage;

  // Construct a where clause based on the search parameters provided
  const whereClause: { [key: string]: any } = {};

  if (id) {
    whereClause.id = {
      equals: id,
    };
  }

  if (status) {
    whereClause.status = {
      equals: status,
    };
  }

  if (email) {
    whereClause.user = {
      email: {
        contains: email,
        mode: "insensitive",
      },
    };
  }

  if (startDate && endDate) {
    // Date range search
    whereClause.createdAt = {
      gte: new Date(startDate),
      lte: new Date(endDate),
    };
  }

  // Find and count the orders
  const [orders, totalOrders] = await Promise.all([
    prisma.order.findMany({
      where: whereClause,
      include: {
        user: true,
        items: true,
      },
      skip,
      take,
    }),
    prisma.order.count({
      where: whereClause,
    }),
  ]);

  const totalPages = Math.ceil(totalOrders / perPage);

  return { orders, totalPages };
};
