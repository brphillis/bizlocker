import { prisma } from "~/db.server";
import bcrypt from "bcryptjs";

export interface StaffSession {
  id: number | null;
  storeId: number | null;
  role: Role;
  email: string;
  isActive: boolean;
}

export const verifyStaffLogin = async (
  email: string,
  password: string
): Promise<{ staff: StaffSession }> => {
  const userWithPassword = await prisma.staff.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
      storeId: true,
      role: true,
      email: true,
      password: true,
      isActive: true,
    },
  });

  if (!userWithPassword || !userWithPassword.password) {
    throw new Error("User Not Found");
  }

  const isValid = await bcrypt.compare(password, userWithPassword.password);

  if (!isValid) {
    throw new Error("Incorrect Credentials");
  }

  if (!userWithPassword.isActive) {
    throw new Error("Staff Member is Not Active.");
  }

  const { password: _password, ...userWithoutPassword } = userWithPassword;
  const staff = userWithoutPassword;

  return { staff };
};
