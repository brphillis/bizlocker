import sgMail from "@sendgrid/mail";
import { Splash_Message_Button } from "../templates/Splash_Message_Button";
sgMail.setApiKey(process.env.SENDGRID_KEY!);

export const sendPasswordResetEmail = async (
  recipient: string,
  verificationCode: string,
) => {
  const verificationLink = `${process.env.SITE_URL}/reset-password/${verificationCode}?email=${recipient}`;

  const template = Splash_Message_Button(
    recipient,
    "Clutch - Forgotten Password",
    "forgotPasswordSplash.png",
    "Reset Password",
    verificationLink,
    "Please click the button below to Reset Your Password.",
  );

  try {
    await sgMail.send(template);
  } catch (err) {
    console.error(err);
  }
};
