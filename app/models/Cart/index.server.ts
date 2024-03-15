import { Cart, User } from "@prisma/client";
import { type TypedResponse, redirect } from "@remix-run/server-runtime";
import { prisma } from "../../db.server";
import { getUserDataFromSession } from "../../session.server";
import { getCookies } from "../../helpers/cookieHelpers";
import { CartWithDetails } from "./types";
import { createISO8601DateNow } from "prisma/validation";

const visitorCartCookieKey = "visitor_cart_id";

export const getVisitorCartId = (request: Request): number | undefined => {
  const cookies = getCookies(request);
  if (cookies) {
    const visitorCart = cookies[visitorCartCookieKey];
    return parseInt(visitorCart);
  }
};

export const getCart = async (id: string): Promise<CartWithDetails | null> => {
  const cart = await prisma.cart.findUnique({
    where: {
      id: parseInt(id),
    },
    include: {
      user: {
        select: {
          email: true,
          id: true,
        },
      },
      cartItems: {
        include: {
          variant: {
            include: {
              product: {
                include: {
                  images: {
                    take: 1,
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
};

export const getSessionCart = async (
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

    // Update the updatedAt field of the cart
    await prisma.cart.update({
      where: { id: cartToUpdate.id },
      data: { updatedAt: createISO8601DateNow() },
    });
  }
  if (userData) {
    return redirect(referer || "/products");
  } else {
    return redirect(referer || "/products", { headers });
  }
};

export const searchCarts = async (
  formData?: { [k: string]: FormDataEntryValue },
  url?: URL,
): Promise<{ carts: Cart[]; totalPages: number }> => {
  const email =
    formData?.email || (url && url.searchParams.get("email")?.toString()) || "";
  const pageNumber =
    (formData?.pageNumber && parseInt(formData.pageNumber as string)) ||
    (url && Number(url.searchParams.get("pageNumber"))) ||
    1;
  const perPage =
    (formData?.perPage && parseInt(formData.perPage as string)) ||
    (url && Number(url.searchParams.get("perPage"))) ||
    10;
  let carts;
  let totalCarts;

  const skip = (pageNumber - 1) * perPage;
  let take = perPage;
  if (perPage !== undefined) {
    if (email) {
      carts = await prisma.cart.findMany({
        where: {
          user: {
            email: {
              contains: (email as string) || "",
              mode: "insensitive",
            },
          },
        },
        include: {
          user: true,
        },
        skip,
        take,
      });

      const totalCount = await prisma.cart.count({
        where: {
          OR: [
            {
              user: {
                email: {
                  contains: (email as string) || "",
                  mode: "insensitive",
                },
              },
            },
          ],
        },
      });

      totalCarts = totalCount;
    } else {
      carts = await prisma.cart.findMany({
        include: {
          user: true,
        },
        skip,
        take,
      });

      totalCarts = await prisma.cart.count();
    }
    // Update `take` for the last page if needed
    if (skip + take > totalCarts) {
      take = totalCarts - skip;
    }
  } else {
    // Retrieve all carts without pagination
    carts = await prisma.cart.findMany();
    totalCarts = carts.length;
  }

  const totalPages = Math.ceil(totalCarts / (Number(perPage) || 10));

  return { carts, totalPages };
};
