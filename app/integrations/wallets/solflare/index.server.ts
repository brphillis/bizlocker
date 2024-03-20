import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";

const isProduction = process.env.NODE_ENV === "production";

const connection = new Connection(
  isProduction
    ? `https://solana-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY}`
    : "https://api.devnet.solana.com",
);

export const createSolanaTransaction = async (
  senderPublicKey: string,
  lamports: number,
): Promise<string> => {
  const privateKeyBytes = Uint8Array.from(
    Buffer.from(process.env.SOLANA_PRIVATE_KEY!, "hex"),
  );

  const keypair = Keypair.fromSecretKey(privateKeyBytes);

  const _senderPublicKey = new PublicKey(senderPublicKey);

  const minimalLamps = isProduction
    ? 0
    : await connection.getMinimumBalanceForRentExemption(0);

  // Construct a transaction to transfer SOL
  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: _senderPublicKey,
      toPubkey: keypair.publicKey,
      lamports: isProduction ? lamports : minimalLamps,
    }),
  );

  const blockdetails = await connection.getLatestBlockhash();

  transaction.lastValidBlockHeight = blockdetails.lastValidBlockHeight;
  transaction.recentBlockhash = blockdetails.blockhash;
  transaction.feePayer = _senderPublicKey;

  // Server signs transaction
  // transaction.sign(keypair);

  // Serialize the transaction
  const serializedTransaction = transaction.serialize({
    verifySignatures: false,
    requireAllSignatures: false,
  });

  // Conv to Base64
  const solanaTransaction = serializedTransaction.toString("base64");

  // Returning the encoded transaction
  return solanaTransaction;
};

export const sendSolanaTransaction = async (signedTransaction: string) => {
  const signature = await connection.sendEncodedTransaction(signedTransaction);

  // const latestBlockHash = await connection.getLatestBlockhash();

  // const confirmStrategy: BlockheightBasedTransactionConfirmationStrategy = {
  //   blockhash: latestBlockHash.blockhash,
  //   lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
  //   signature: signature,
  // };

  // const transactionResponse =
  //   await connection.confirmTransaction(confirmStrategy);

  return signature;
};
