import { prisma } from "~/db.server";
import { sendEmailVerificationEmail } from "~/integrations/sendgrid/emails/emailVerification";
import { sendPasswordResetEmail } from "~/integrations/sendgrid/emails/passwordReset";

export const initiateVerifyUserAccount = async (email: string) => {
  const { code: verificationCode } = await prisma.verifier.create({
    data: {
      email: email,
      type: "email",
    },
  });

  if (verificationCode) {
    await sendEmailVerificationEmail(email, verificationCode);
    return { success: true };
  } else return { success: false };
};

export const requestNewVerifyEmail = async (
  email: string,
  type: VerifyTypes
) => {
  const existingVerifier = await prisma.verifier.findFirst({
    where: { email, type },
    select: { id: true, code: true, email: true, type: true },
  });

  if (existingVerifier) {
    const { code } = existingVerifier;

    if (existingVerifier.type === "email" && code) {
      await sendEmailVerificationEmail(email, code);
      return { success: true };
    } else if (existingVerifier.type === "password" && code) {
      await sendPasswordResetEmail(email, code);
      return { success: true };
    } else {
      return { success: false };
    }
  } else {
    if (type === "email") {
      await initiateVerifyUserAccount(email);
      return { success: true };
    } else if (type === "password") {
      await initiatePasswordReset(email);
      return { success: true };
    } else {
      return { success: false };
    }
  }
};

export const verifyUserAccount = async (
  email: string,
  verificationCode: string
) => {
  try {
    const {
      id,
      code: storedCode,
      email: storedEmail,
    } = (await prisma.verifier.findFirst({
      where: { email, type: "email" },
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

      await prisma.verifier.delete({
        where: { id: id },
      });

      return { success: true, email: storedEmail };
    } else {
      return { success: false };
    }
  } catch (err) {
    return { success: false };
  }
};

export const initiatePasswordReset = async (email: string) => {
  const { code: verificationCode } = await prisma.verifier.create({
    data: {
      email: email,
      type: "password",
    },
  });

  if (verificationCode) {
    await sendPasswordResetEmail(email, verificationCode);
    return { success: true };
  } else return { success: false };
};

export const verifyPasswordReset = async (
  email: string,
  verificationCode: string,
  deleteVerifier?: boolean
) => {
  try {
    const {
      id,
      code: storedCode,
      email: storedEmail,
    } = (await prisma.verifier.findFirst({
      where: { email, type: "password" },
      select: { id: true, code: true, email: true },
    })) || {};

    if (
      storedCode === verificationCode &&
      storedEmail === email &&
      deleteVerifier
    ) {
      await prisma.verifier.delete({
        where: { id: id },
      });

      return { success: true, email: storedEmail };
    } else {
      return { success: false };
    }
  } catch (err) {
    return { success: false };
  }
};
