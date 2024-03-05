import { useWallet } from "@solana/wallet-adapter-react";
import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { useEffect, useState } from "react";
import * as buffer from "buffer";
import { useSubmit } from "@remix-run/react";
import { validateForm } from "~/utility/validate";
import { Toast } from "~/components/Notifications/Toast";
import { capitalizeAndSpace } from "~/helpers/stringHelpers";
import { calculateOrderTotalInLamports } from "../../helpers";
import { SOLANA_WALLET } from "~/build/clientEnv";

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
};

const PaymentButton = ({ solanaPriceAUD }: Props) => {
  const submit = useSubmit();
  const [transactionId, setTransactionId] = useState<string>();

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
      console.log("formerrors", formErrors);

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

    const connection = new Connection(
      "https://solana-mainnet.g.alchemy.com/v2/alcht_8oufyyaTqridaf8devlAysKMalHUNU",
    );

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

    const senderPublicKey = publicKey;

    const recipientPublicKey = new PublicKey(SOLANA_WALLET!);

    const orderTotalInLamports = calculateOrderTotalInLamports(
      orderTotalPlusShipping,
      solanaPriceAUD,
    );

    try {
      // Construct a transaction to transfer SOL
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: senderPublicKey,
          toPubkey: recipientPublicKey,
          lamports: orderTotalInLamports,
        }),
      );

      const blockdetails = await connection.getLatestBlockhash();

      transaction.lastValidBlockHeight = blockdetails.lastValidBlockHeight;
      transaction.recentBlockhash = blockdetails.blockhash;
      transaction.feePayer = senderPublicKey;

      // Popup Appears
      const signedTransaction = await signTransaction(transaction);

      // Send the signed transaction
      const transactionResponse = await sendTransaction(
        signedTransaction,
        connection,
      );

      setTransactionId(transactionResponse);
    } catch (error) {
      console.error("Transaction failed:", error);
    }
  };

  useEffect(() => {
    window.Buffer = buffer.Buffer;
  }, []);

  useEffect(() => {
    if (transactionId) {
      const formData = new FormData();
      formData.set("_action", "processOrder");
      formData.set("transactionId", transactionId);

      const currentForm = document.getElementById(
        "CheckoutForm",
      ) as HTMLFormElement;

      if (currentForm) {
        for (const [key, value] of new FormData(currentForm)) {
          formData.set(key, value);
        }
      }

      submit(formData, { method: "POST" });
    }
  }, [submit, transactionId]);

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
