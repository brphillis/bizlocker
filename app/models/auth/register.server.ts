import { prisma } from "~/db.server";
import bcrypt from "bcryptjs";
import { sendEmailVerificationEmail } from "~/integrations/sendgrid/emails/emailVerification";

export const registerUser = async (email: string, password: string) => {
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

  const { code: verificationCode } = await prisma.emailVerifier.create({
    data: {
      email: email,
    },
  });

  if (verificationCode) {
    await sendEmailVerificationEmail(email, verificationCode);
    success = true;
  }

  return { success };
};
