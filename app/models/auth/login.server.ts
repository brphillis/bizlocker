import { prisma } from "~/db.server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { createUserSession } from "~/session.server";

export type { User } from "@prisma/client";

export const verifyLogin = async (
  email: string,
  password: string,
  verifiedOnly: boolean = true
) => {
  const userWithPassword = await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
      email: true,
      verified: true,
      password: true,
      cartId: true,
    },
  });

  if (!userWithPassword || !userWithPassword.password) {
    const error = "No Email or Password Provided";
    return { error };
  }

  const isValid = await bcrypt.compare(password, userWithPassword.password);

  if (!isValid) {
    const error = "Incorrect Credentials";
    return { error };
  }

  if (!userWithPassword.verified && verifiedOnly) {
    const error = "Email not Verified, Please Check Your Email.";
    return { error };
  }

  const {
    password: _password,
    verified: _verified,
    ...userWithoutPassword
  } = userWithPassword;
  const user = userWithoutPassword;

  console.log("RETURNED USER", user);

  return { user };
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
