import { redirect } from "@remix-run/server-runtime";
import { prisma } from "~/db.server";
import {
  USER_SESSION_KEY,
  getSession,
  getUserObject,
  sessionStorage,
} from "~/session.server";

export const getCart = async (request: Request) => {
  const userData = (await getUserObject(request)) as User;
  const cartId = userData?.cart?.id;

  if (!cartId) return null;

  return await prisma.cart.findUnique({
    where: {
      id: cartId,
    },
    include: {
      cartItems: {
        include: {
          variant: {
            include: {
              product: {
                include: {
                  images: true,
                },
              },
            },
          },
        },
      },
    },
  });
};

export const addToCart = async (
  request: Request,
  variantId: string,
  quantity: string
) => {
  const referer = request.headers.get("referer");
  const userData = await getUserObject(request);
  const userId = userData?.id;

  let userCart = await prisma.cart.findFirst({
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

  if (!userCart) {
    userCart = await prisma.cart.create({
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

  const existingCartItem = userCart.cartItems.find(
    (item) => item.variantId === parseInt(variantId)
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
          cartId: userCart.id,
        },
      });

      // If there are no remaining items, delete the cart
      if (remainingItems.length === 0) {
        await prisma.cart.delete({
          where: {
            id: userCart.id,
          },
        });

        //remove the cart from current user cookie
        const userNoCart = {
          ...userData,
          cart: null,
        };

        const session = await getSession(request);
        session.set(USER_SESSION_KEY, userNoCart);
        return redirect(referer || "/products", {
          headers: {
            "Set-Cookie": await sessionStorage.commitSession(session),
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
            id: userCart.id,
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

  // Fetch the updated cart with cartItems, including user and productVariants
  const updatedCart = await prisma.cart.findUnique({
    where: {
      id: userCart.id,
    },
    include: {
      cartItems: {
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
      user: {
        select: {
          id: true,
        },
      },
    },
  });

  const updatedUser = {
    ...userData,
    cart: updatedCart,
  };

  const session = await getSession(request);
  session.set(USER_SESSION_KEY, updatedUser);
  return redirect(referer || "/products", {
    headers: { "Set-Cookie": await sessionStorage.commitSession(session) },
  });
};
