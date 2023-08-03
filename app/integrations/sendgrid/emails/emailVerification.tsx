import sgMail from "@sendgrid/mail";
import { Splash_Message_Button } from "../templates/Splash_Message_Button";
sgMail.setApiKey(process.env.SENDGRID_KEY!);

export const sendEmailVerificationEmail = async (
  recipient: string,
  verificationCode: string
) => {
  const verificationLink = `${process.env.DEV_URL}/verify-account/${verificationCode}?email=${recipient}`;

  const template = Splash_Message_Button(
    recipient,
    "Welcome to Clutch - Please Verify Your Email",
    "verifySplash.png",
    "Verify Account",
    verificationLink,
    "Thankyou for joining Clutch, Please verify your account"
  );

  try {
    await sgMail.send(template);
  } catch (err) {
    console.error(err);
  }
};
