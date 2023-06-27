import bcrypt from "bcryptjs";

import { prisma } from "~/db.server";

export type { User } from "@prisma/client";

export async function getUserById(id: User["id"]) {
  return prisma.user.findUnique({ where: { id } });
}

export async function getUserByEmail(email: User["email"]) {
  return prisma.user.findUnique({ where: { email } });
}

export async function deleteUserByEmail(email: User["email"]) {
  return prisma.user.delete({ where: { email } });
}

export async function verifyLogin(email: string, password: string) {
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
}
