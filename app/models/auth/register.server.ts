import { prisma } from "~/db.server";
import bcrypt from "bcryptjs";
import { initiateVerifyUserAccount } from "./verification.server";

export const registerUser = async (
  email: string,
  password: string
): Promise<{ success: boolean }> => {
  let success;
  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    throw new Error("User Already Exists");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
    },
  });

  await initiateVerifyUserAccount(email);

  success = true;

  return { success };
};

export const resetUserPassword = async (
  email: string,
  password: string
): Promise<{ success: boolean }> => {
  const userToUpdate = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (userToUpdate) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      await prisma.user.update({
        where: {
          email,
        },
        data: {
          password: hashedPassword,
        },
      });

      return { success: true };
    } catch (error) {
      throw new Error("An Error has Occured.");
    }
  } else {
    throw new Error("User Could Not Be Found.");
  }
};
