import type { TypedResponse } from "@remix-run/server-runtime";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "~/db.server";
import { createUserSession } from "~/session.server";

export interface UserLoginResponse {
  id: string;
  email: string;
}

export const verifyLogin = async (
  email: string,
  password: string,
  verifiedOnly: boolean = true
): Promise<{ user: UserLoginResponse | null; error: string | null }> => {
  const userWithPassword = await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
      email: true,
      verified: true,
      password: true,
    },
  });

  if (!userWithPassword || !userWithPassword.password) {
    const error = "User Not Found";
    return { error, user: null };
  }

  const isValid = await bcrypt.compare(password, userWithPassword.password);

  if (!isValid) {
    const error = "Incorrect Credentials";
    return { error, user: null };
  }

  if (!userWithPassword.verified && verifiedOnly) {
    const error = "Email not Verified, Please Check Your Email.";
    return { error, user: null };
  }

  const { ...userWithoutPassword } = userWithPassword;

  const user = userWithoutPassword;

  return { user, error: null };
};

export const googleLogin = async (
  request: Request,
  credential: any
): Promise<undefined | TypedResponse<never>> => {
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
        verified: true,
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
