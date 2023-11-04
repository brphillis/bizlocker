import { prisma } from "~/db.server";
import bcrypt from "bcryptjs";

export type { User } from "@prisma/client";

export const verifyStaffLogin = async (email: string, password: string) => {
  const userWithPassword = await prisma.staff.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
      email: true,
      password: true,
      isActive: true,
    },
  });

  if (!userWithPassword || !userWithPassword.password) {
    const error = "User Not Found";
    return { error };
  }

  const isValid = await bcrypt.compare(password, userWithPassword.password);

  if (!isValid) {
    const error = "Incorrect Credentials";
    return { error };
  }

  if (!userWithPassword.isActive) {
    const error = "Staff Member is Not Active.";
    return { error };
  }

  const { password: _password, ...userWithoutPassword } = userWithPassword;
  const user = userWithoutPassword;

  return { user };
};
