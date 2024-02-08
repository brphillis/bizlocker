import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "~/db.server";
import { createUserSession } from "~/session.server";
import { ValidationErrors } from "~/utility/validate";
import { TypedResponse } from "@remix-run/server-runtime";
import { GoogleAuthResponse } from "~/integrations/authentication/google/types";
import { UserLoginResponse } from "./types";

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
  credential: string,
): Promise<{
  session?: TypedResponse<never>;
  validationErrors?: ValidationErrors;
}> => {
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user;

    const session = await createUserSession({
      request,
      user: JSON.stringify(userWithoutPassword),
      remember: true,
      redirectTo: "/",
    });

    return { session, validationErrors: undefined };
  } else if (user && !user.googleLogin) {
    const validationErrors: ValidationErrors = {};

    validationErrors.emailExists = "Email Exists Without Single Sign On.";

    return { session: undefined, validationErrors };
  } else {
    const user = await prisma.user.create({
      data: {
        email: credentials?.email,
        googleLogin: true,
        googleEmail: credentials?.email,
        verified: true,
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user;

    const session = await createUserSession({
      request,
      user: JSON.stringify(userWithoutPassword),
      remember: true,
      redirectTo: "/",
    });

    return { session, validationErrors: undefined };
  }
};
