import { prisma } from "~/db.server";

export const verifyUserAccount = async (
  email: string,
  verificationCode: string
) => {
  try {
    const {
      id,
      code: storedCode,
      email: storedEmail,
    } = (await prisma.emailVerifier.findUnique({
      where: { email },
      select: { id: true, code: true, email: true },
    })) || {};

    if (storedCode === verificationCode && storedEmail === email) {
      await prisma.user.update({
        where: {
          email,
        },
        data: {
          verified: true,
        },
      });

      await prisma.emailVerifier.delete({
        where: { id: id },
      });

      return { success: true };
    } else {
      return { success: false };
    }
  } catch (err) {
    return { success: false };
  }
};
