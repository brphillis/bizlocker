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
};

export const WalletAdapterButton = ({
  solanaPriceAUD,
  solanaTransaction,
  transactionResponse,
}: Props) => {
  //CHANGE BACK
  const network =
    (CLIENT_ENV as unknown) === "PRODUCTION"
      ? WalletAdapterNetwork.Devnet
      : WalletAdapterNetwork.Mainnet;

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
          />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default WalletAdapterButton;
