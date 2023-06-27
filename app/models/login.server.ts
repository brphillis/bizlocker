import { prisma } from "~/db.server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { createUserSession } from "~/session.server";

export type { User } from "@prisma/client";

export const verifyLogin = async (email: string, password: string) => {
  const userWithPassword = await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
      email: true,
      password: true,
      cart: {
        select: {
          id: true,
          cartItems: {
            include: {
              variant: {
                select: {
                  id: true,
                  price: true,
                  salePrice: true,
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
              email: true,
            },
          },
        },
      },
    },
  });

  if (!userWithPassword || !userWithPassword.password) {
    return null;
  }

  const isValid = await bcrypt.compare(password, userWithPassword.password);

  if (!isValid) {
    return null;
  }

  const { password: _password, ...userWithoutPassword } = userWithPassword;

  return userWithoutPassword;
};

export const googleLogin = async (request: Request, credential: any) => {
  const credentials = jwt.decode(credential) as GoogleAuthResponse;

  const user = await prisma.user.findUnique({
    where: {
      email: credentials?.email,
    },
    select: {
      id: true,
      email: true,
      password: true,
      googleLogin: true,
      cart: {
        select: {
          id: true,
          cartItems: {
            include: {
              variant: {
                select: {
                  id: true,
                  price: true,
                  salePrice: true,
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
              email: true,
            },
          },
        },
      },
    },
  });

  if (user && user.googleLogin) {
    const { password: _, ...userWithoutPassword } = user;

    return createUserSession({
      request,
      user: JSON.stringify(userWithoutPassword),
      remember: true,
      redirectTo: "/",
    });
  } else if (user && !user.googleLogin) {
    throw new Error("Email Already Exists Without Google Login");
  } else if (!user) {
    const user = await prisma.user.create({
      data: {
        email: credentials?.email,
        googleLogin: true,
        googleEmail: credentials?.email,
      },
    });

    const { password: _, ...userWithoutPassword } = user;

    return createUserSession({
      request,
      user: JSON.stringify(userWithoutPassword),
      remember: true,
      redirectTo: "/",
    });
  }
};
