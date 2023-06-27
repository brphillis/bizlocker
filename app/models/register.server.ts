import { prisma } from "~/db.server";
import bcrypt from "bcryptjs";
import { redirect } from "@remix-run/server-runtime";

export const registerUser = async (email: string, password: string) => {
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

  return redirect("/login");
};
