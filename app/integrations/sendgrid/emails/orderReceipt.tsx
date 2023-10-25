import sgMail from "@sendgrid/mail";
import { Order_Receipt } from "../templates/Order_Receipt";
sgMail.setApiKey(process.env.SENDGRID_KEY!);

export const sendOrderReceiptEmail = async (
  recipient: string,
  order: Order,
  shippingDetails: SquareShippingDetails
) => {
  const template = Order_Receipt(
    recipient,
    order,
    shippingDetails,
    "Thankyou for Shopping with Clutch Clothing",
    "Thank you for choosing Clutch Clothing as your fashion destination. We're truly grateful for your support and trust in our brand. Your satisfaction is our ultimate goal, and we look forward to serving your style needs in the future.",
    "Our 30-day return policy ensures a stress-free shopping experience. If you're not satisfied with your purchase, return the item in its original condition with tags attached for a quick resolution. Your satisfaction is our priority."
  );

  try {
    await sgMail.send(template);
  } catch (err) {
    console.error(err);
  }
};
