import { prisma } from "~/db.server";

export const getDepartments = async () => {
  return await prisma.department.findMany();
};
