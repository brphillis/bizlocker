import type { TypedResponse } from "@remix-run/server-runtime";
import type { GoogleAuthResponse } from "~/components/Auth/LoginGoogle/types";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "~/db.server";
import { createUserSession } from "~/session.server";
import { ValidationErrors } from "~/utility/validate";

export interface UserLoginResponse {
  id: number;
  email: string;
}

export const verifyLogin = async (
  email: string,
  password: string,
  verifiedOnly: boolean = true,
): Promise<{
  user: UserLoginResponse | null;
  validationErrors?: ValidationErrors;
}> => {
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

  const validationErrors: ValidationErrors = {};

  if (!userWithPassword || !userWithPassword.password) {
    validationErrors.userNotFound = "User Not Found";
    return { validationErrors, user: null };
  }

  const isValid = await bcrypt.compare(password, userWithPassword.password);

  if (!isValid) {
    validationErrors.credentials = "Incorrect Credentials";
    return { validationErrors, user: null };
  }

  if (!userWithPassword.verified && verifiedOnly) {
    validationErrors.verified = "Email not Verified, Please Check Your Email.";
    return { validationErrors, user: null };
  }

  const { ...userWithoutPassword } = userWithPassword;

  const user = userWithoutPassword;

  return { user };
};

export const googleLogin = async (
  request: Request,
  credential: any,
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

    return await createUserSession({
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

    return await createUserSession({
      request,
      user: JSON.stringify(userWithoutPassword),
      remember: true,
      redirectTo: "/",
    });
  }
};
