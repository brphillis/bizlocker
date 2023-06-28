import { redirect } from "@remix-run/server-runtime";
import { randomUUID } from "crypto";
import { prisma } from "~/db.server";
import {
  USER_SESSION_KEY,
  getSession,
  getUserObject,
  sessionStorage,
} from "~/session.server";
import { squareClient } from "~/square.server";
import { createSquarePaymentLink } from "~/utility/squareHelpers.server";

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
      user: true,
    },
  });
};

export const getOrdersCurrentUser = async (request: Request) => {
  const userData = (await getUserObject(request)) as User;
  const userId = userData?.id;

  return await prisma.order.findMany({
    where: {
      userId: userId,
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
      user: true,
    },
  });
};

export const getOrderShippingDetails = async (orderId: string) => {
  const response = await squareClient.ordersApi.retrieveOrder(orderId);

  if (!response || !response.result || !response.result.order) {
    return null;
  }

  const shippingDetails = response.result.order.fulfillments?.find(
    (fulfillment) => fulfillment.type === "SHIPMENT"
  )?.shipmentDetails?.recipient?.address;

  if (!shippingDetails) {
    return null;
  }

  return shippingDetails;
};

export const createOrder = async (request: Request) => {
  const userData = (await getUserObject(request)) as User;

  const cartId = userData?.cart?.id;

  //retrieve the cart from the database based on the provided cartId
  const cart = await prisma.cart.findUnique({
    where: {
      id: cartId,
    },
    include: {
      cartItems: {
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

  if (!cart) {
    throw new Error("Cart not found");
  }

  //   if (cart.userId !== req.cookies.current_user.id) {
  //     return res
  //       .status(401)
  //       .json({ error: "Unauthorized. You do not own this Cart." });
  //   }

  const cartItems = cart?.cartItems as unknown as CartItem[];
  const userId = userData.id;

  const { createPaymentLinkResponse, confirmCode } =
    await createSquarePaymentLink(cartItems, userId);

  if (createPaymentLinkResponse && createPaymentLinkResponse.paymentLink) {
    const { paymentLink } = createPaymentLinkResponse;

    const orderItems: NewOrderItem[] = [];
    let totalPrice = 0;

    //create the order object
    for (const { variantId, variant, quantity } of cartItems) {
      const { isOnSale, salePrice, price } = variant;
      const itemTotalPrice = isOnSale ? salePrice : price;

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
        paymentCode: confirmCode,
        totalPrice: totalPrice,
        paymentUrl: paymentLink.url!,
        paymentLinkId: paymentLink.id!,
        user: {
          connect: {
            id: userId,
          },
        },
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
        cartId: cartId,
      },
    });

    await prisma.cart.delete({
      where: {
        id: cartId,
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
      items: true,
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
  for (const item of order.items) {
    await prisma.productVariant.update({
      where: {
        id: item.variantId,
      },
      data: {
        stock: {
          decrement: item.quantity,
        },
      },
    });
  }

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
  shippingDetails: SquareShippingDetails
) => {
  const response = await squareClient.ordersApi.retrieveOrder(orderId);

  if (!response || !response.result || !response.result.order) {
    throw new Error("Order not found");
  }

  let shipmentFulfillment = response.result.order.fulfillments?.find(
    (fulfillment) => fulfillment.type === "SHIPMENT"
  );

  // If there isn't a 'SHIPMENT' fulfillment, create a new one
  if (!shipmentFulfillment) {
    shipmentFulfillment = {
      type: "SHIPMENT",
      shipmentDetails: {
        recipient: {
          address: shippingDetails,
        },
      },
    };
    // Add the new fulfillment to the order's fulfillments
    response.result.order.fulfillments = [
      ...(response.result.order.fulfillments || []),
      shipmentFulfillment,
    ];
  } else if (
    shipmentFulfillment.shipmentDetails &&
    shipmentFulfillment.shipmentDetails.recipient
  ) {
    // If there is a 'SHIPMENT' fulfillment but it does not have shipment details, add them
    shipmentFulfillment.shipmentDetails.recipient.address = shippingDetails;
  } else {
    if (shipmentFulfillment.shipmentDetails)
      // If there is a 'SHIPMENT' fulfillment and it has shipment details but does not have a recipient, add one
      shipmentFulfillment.shipmentDetails.recipient = {
        address: shippingDetails,
      };
  }

  // Update the order with the modified details
  const updateResponse = await squareClient.ordersApi.updateOrder(orderId, {
    order: response.result.order,
    idempotencyKey: randomUUID(),
  });

  if (
    !updateResponse ||
    !updateResponse.result ||
    !updateResponse.result.order
  ) {
    throw new Error("Order not Updated");
  }

  return null;
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
