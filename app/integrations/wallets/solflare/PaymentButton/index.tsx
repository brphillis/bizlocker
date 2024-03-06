import { useWallet } from "@solana/wallet-adapter-react";
import { Transaction } from "@solana/web3.js";
import { useEffect } from "react";
import * as buffer from "buffer";
import { useSubmit } from "@remix-run/react";
import { validateForm } from "~/utility/validate";
import { Toast } from "~/components/Notifications/Toast";
import { capitalizeAndSpace } from "~/helpers/stringHelpers";
import { calculateOrderTotalInLamports } from "../../helpers";

export const checkoutFormValidation = {
  firstName: true,
  lastName: true,
  email: true,
  addressLine1: true,
  suburb: true,
  postcode: true,
  state: true,
  country: true,
  phoneNumber: true,
  shippingOptions: true,
};

type Props = {
  solanaPriceAUD?: number;
  solanaTransaction?: string;
  transactionResponse?: unknown;
};

const PaymentButton = ({
  solanaPriceAUD,
  solanaTransaction,
  transactionResponse,
}: Props) => {
  const submit = useSubmit();

  const { connected, publicKey, signTransaction, sendTransaction } =
    useWallet();

  const createTransaction = async () => {
    const formData = new FormData();
    const currentForm = document.getElementById(
      "CheckoutForm",
    ) as HTMLFormElement;

    if (currentForm) {
      for (const [key, value] of new FormData(currentForm)) {
        formData.set(key, value);
      }
    }

    const { formErrors } = validateForm(formData, checkoutFormValidation);

    if (formErrors) {
      const keys = Object.keys(formErrors);

      Toast(
        "error",
        2000,
        capitalizeAndSpace(keys[0]) + " - " + formErrors[keys[0]],
      );
      return;
    }

    const shippingTotal = Number(
      formData.get("shippingOptions")?.toString().split("_")[1],
    );

    const orderTotal = Number(formData.get("orderTotal") as string);

    if (!shippingTotal || !orderTotal || !solanaPriceAUD) {
      Toast("error", 2000, "Could not Calculate Price");
      return;
    }

    const orderTotalPlusShipping = shippingTotal + orderTotal;

    if (
      isNaN(shippingTotal) ||
      isNaN(orderTotal) ||
      isNaN(orderTotalPlusShipping)
    ) {
      Toast("error", 2000, "Could not Calculate Price");
      return;
    }

    if (!connected) {
      console.error("Wallet not connected");
      return;
    }

    if (!publicKey) {
      console.error("Wallet not connected");
      return;
    }

    if (!signTransaction) {
      console.error("Sign transaction function is not available");
      return;
    }

    const orderTotalInLamports = calculateOrderTotalInLamports(
      orderTotalPlusShipping,
      solanaPriceAUD,
    );

    const createTransactionFormData = new FormData();

    createTransactionFormData.set("_action", "createSolanaTransaction");
    createTransactionFormData.set("lamports", orderTotalInLamports.toString());
    createTransactionFormData.set("senderPublicKey", publicKey.toString());

    submit(createTransactionFormData, { method: "POST" });
  };

  // Prompt user to sign and accept/deny
  useEffect(() => {
    if (solanaTransaction && signTransaction) {
      const initiateSignTransaction = async () => {
        try {
          const transactionBuffer = Buffer.from(solanaTransaction, "base64");

          const deserializedTransaction = Transaction.from(transactionBuffer);

          const signedTransaction = await signTransaction(
            deserializedTransaction,
          );

          const serializedTransaction = signedTransaction.serialize({
            verifySignatures: false,
            requireAllSignatures: false,
          });

          const encodedTransaction = serializedTransaction.toString("base64");

          const formData = new FormData();
          formData.set("_action", "sendSolanaTransaction");
          formData.set("signedTransaction", encodedTransaction);
          submit(formData, { method: "POST" });
        } catch (error) {
          console.error("Transaction failed:", error);
        }
      };

      initiateSignTransaction();
    }
  }, [solanaTransaction, sendTransaction, signTransaction, submit]);

  // Create the order in the CMS
  useEffect(() => {
    if (transactionResponse) {
      const formData = new FormData();
      formData.set("_action", "processOrder");
      formData.set("transactionId", transactionResponse as string);

      const currentForm = document.getElementById(
        "CheckoutForm",
      ) as HTMLFormElement;

      // Add all user details to the form
      if (currentForm) {
        for (const [key, value] of new FormData(currentForm)) {
          formData.set(key, value);
        }
      }

      submit(formData, { method: "POST" });
    }
  }, [submit, transactionResponse]);

  // Specify Client Buffer
  useEffect(() => {
    window.Buffer = buffer.Buffer;
  }, []);

  return (
    <>
      {connected && (
        <>
          <button
            className="bg-gradient-to-t from-purple-800 via-violet-600 to-blue-400 hover:scale-[1.01] transition-transform duration-300 p-3 text-brand-white font-semibold rounded-sm"
            onClick={() => createTransaction()}
            type="button"
          >
            Solana Checkout
          </button>
        </>
      )}
    </>
  );
};

export default PaymentButton;
