import { User } from "@prisma/client";
import { type TypedResponse, redirect } from "@remix-run/server-runtime";
import { prisma } from "~/db.server";
import { getUserDataFromSession } from "~/session.server";
import { getCookies } from "~/helpers/cookieHelpers";
import { CartWithDetails } from "./types";

const visitorCartCookieKey = "visitor_cart_id";

export const getVisitorCartId = (request: Request): number | undefined => {
  const cookies = getCookies(request);
  if (cookies) {
    const visitorCart = cookies[visitorCartCookieKey];
    return parseInt(visitorCart);
  }
};

export const getCart = async (
  request: Request,
): Promise<CartWithDetails | null> => {
  const { id } = ((await getUserDataFromSession(request)) as User) || {};

  let visitorCartId;
  let whereClause;

  if (!id) {
    visitorCartId = getVisitorCartId(request);

    whereClause = {
      id: visitorCartId,
    };
  } else {
    whereClause = {
      userId: id,
    };
  }

  if (id || visitorCartId) {
    const cart = await prisma.cart.findUnique({
      where: whereClause,
      include: {
        cartItems: {
          include: {
            variant: {
              include: {
                stock: {
                  select: {
                    storeId: true,
                    quantity: true,
                  },
                },
                product: {
                  select: {
                    id: true,
                    name: true,
                    images: true,
                    promotion: {
                      select: {
                        discountPercentage: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    return cart as CartWithDetails;
  } else return null;
};

export const addToCart = async (
  request: Request,
  variantId: string,
  quantity: string,
): Promise<TypedResponse<never>> => {
  const headers = new Headers();
  const referer = request.headers.get("referer");
  const userData = await getUserDataFromSession(request);
  const userId = userData?.id;
  let cartToUpdate;

  // handling logged in user
  if (userData) {
    cartToUpdate = await prisma.cart.findFirst({
      where: {
        userId: userId,
      },
      include: {
        cartItems: {
          include: {
            variant: {
              select: { id: true },
            },
          },
        },
        user: {
          select: {
            id: true,
          },
        },
      },
    });
    //create new cart for logged in user if none exists
    if (!cartToUpdate) {
      cartToUpdate = await prisma.cart.create({
        data: {
          user: { connect: { id: userId } },
        },
        include: {
          cartItems: {
            include: {
              variant: {
                select: { id: true },
              },
            },
          },
          user: {
            select: {
              id: true,
            },
          },
        },
      });
    }
  } else {
    //handling non logged in user
    const visitorCartId = getVisitorCartId(request);

    if (visitorCartId) {
      // handle adding to existing visitor cart
      cartToUpdate = await prisma.cart.findFirst({
        where: {
          id: visitorCartId,
        },
        include: {
          cartItems: {
            include: {
              variant: {
                select: { id: true },
              },
            },
          },
          user: {
            select: {
              id: true,
            },
          },
        },
      });
    }

    if (!cartToUpdate) {
      // handle creating new visitor cart and adding item to it
      cartToUpdate = await prisma.cart.create({
        data: {},
        include: {
          cartItems: {
            include: {
              variant: {
                select: { id: true },
              },
            },
          },
        },
      });

      // store the visitor cart ID in the cookie
      headers.append("Set-Cookie", cartToUpdate.id.toString());
      headers.append(
        "Set-Cookie",
        `${visitorCartCookieKey}=${cartToUpdate.id.toString()}; HttpOnly; SameSite=Lax; Path=/;`,
      );
    }
  }

  //Update the cart
  const existingCartItem = cartToUpdate.cartItems.find(
    (item) => item.variantId === parseInt(variantId),
  );

  if (existingCartItem) {
    // Variant already exists in the cart, update the quantity
    const newQuantity = existingCartItem.quantity + parseInt(quantity);

    if (newQuantity <= 0) {
      // If the quantity is less than or equal to zero, delete the item from the cart
      await prisma.cartItem.delete({
        where: {
          id: existingCartItem.id,
        },
      });

      // Check if there are any remaining items in the cart
      const remainingItems = await prisma.cartItem.findMany({
        where: {
          cartId: cartToUpdate.id,
        },
      });

      // If there are no remaining items, delete the cart
      if (remainingItems.length === 0) {
        await prisma.cart.delete({
          where: {
            id: cartToUpdate.id,
          },
        });
      }
    } else {
      // Otherwise, update the quantity of the cart item
      await prisma.cartItem.update({
        where: {
          id: existingCartItem.id,
        },
        data: {
          quantity: newQuantity,
        },
        include: {
          variant: {
            select: { id: true },
          },
        },
      });
    }
  } else {
    // Variant doesn't exist in the cart, create a new cart item
    const productVariant = await prisma.productVariant.findUnique({
      where: {
        id: parseInt(variantId),
      },
    });

    if (!productVariant) {
      throw new Error("Variant not found");
    }

    await prisma.cartItem.create({
      data: {
        quantity: parseInt(quantity),
        cart: {
          connect: {
            id: cartToUpdate.id,
          },
        },
        variant: {
          connect: {
            id: parseInt(variantId),
          },
        },
      },
      include: {
        variant: {
          select: { id: true },
        },
      },
    });
  }
  if (userData) {
    return redirect(referer || "/products");
  } else {
    return redirect(referer || "/products", { headers });
  }
};
