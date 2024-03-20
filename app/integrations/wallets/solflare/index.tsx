import { useMemo } from "react";
import { clusterApiUrl } from "@solana/web3.js";

import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";

import "@solana/wallet-adapter-react-ui/styles.css";

import PaymentButton from "./PaymentButton";
import { CLIENT_ENV } from "~/build/clientEnv";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";

type Props = {
  solanaPriceAUD?: number;
  solanaTransaction?: string;
  transactionResponse?: unknown;
  disableValidation?: boolean;
  checkoutButtonLabel?: string;
};

export const WalletAdapterButton = ({
  solanaPriceAUD,
  solanaTransaction,
  transactionResponse,
  disableValidation,
  checkoutButtonLabel,
}: Props) => {
  const network =
    (CLIENT_ENV as unknown) === "PRODUCTION"
      ? WalletAdapterNetwork.Mainnet
      : WalletAdapterNetwork.Devnet;

  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const wallets = useMemo(() => [], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets}>
        <WalletModalProvider>
          <WalletMultiButton />
          <PaymentButton
            solanaPriceAUD={solanaPriceAUD}
            solanaTransaction={solanaTransaction}
            transactionResponse={transactionResponse}
            disableValidation={disableValidation}
            checkoutButtonLabel={checkoutButtonLabel}
          />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default WalletAdapterButton;
