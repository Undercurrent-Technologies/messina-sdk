import * as anchor from "@project-serum/anchor";
import {
  NATIVE_MINT,
  TokenAccountNotFoundError,
  TokenInvalidAccountOwnerError,
  createAssociatedTokenAccountInstruction,
  createSyncNativeInstruction,
  getAccount,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";

export const TOKEN_BRIDGE_PROGRAM_ID_DEVNET = "5egA5WZgN4fbeaWtE3WwUUJ2iYTF9e5hWYVn6SF61drZ";
export const WORMHOLE_PROGRAM_ID_DEVNET = "3u8hJUVTA4jH1wYAyUur7FFZVQ8H635K3tSHHF4ssjQ5";

export async function buildInstructionsWrapSol(
  connection: anchor.web3.Connection,
  payer: anchor.web3.PublicKey,
  user: anchor.web3.PublicKey,
  lamports: number
) {
  const instructions: anchor.web3.TransactionInstruction[] = [];
  const associatedTokenAccount = getAssociatedTokenAddressSync(NATIVE_MINT, user);
  try {
    await getAccount(connection, associatedTokenAccount);
  } catch (error: unknown) {
    if (error instanceof TokenAccountNotFoundError || error instanceof TokenInvalidAccountOwnerError) {
      instructions.push(createAssociatedTokenAccountInstruction(payer, associatedTokenAccount, user, NATIVE_MINT));
    }
  }

  if (lamports > 0) {
    instructions.push(
      anchor.web3.SystemProgram.transfer({
        fromPubkey: user,
        toPubkey: associatedTokenAccount,
        lamports: lamports,
      }),
      createSyncNativeInstruction(associatedTokenAccount)
    );
  }

  return instructions;
}

export async function createAndSendV0Tx(
  connection: anchor.web3.Connection,
  signers: anchor.web3.Keypair[],
  txInstructions: anchor.web3.TransactionInstruction[],
  addressLookupTableAccounts?: anchor.web3.AddressLookupTableAccount[]
) {
  try {
    // Step 1 - Fetch Latest Blockhash
    let latestBlockhash = await connection.getLatestBlockhash("finalized");

    // Step 2 - Generate Transaction Message
    const messageV0 = new anchor.web3.TransactionMessage({
      payerKey: signers[0].publicKey,
      recentBlockhash: latestBlockhash.blockhash,
      instructions: txInstructions,
    }).compileToV0Message(addressLookupTableAccounts);
    const transaction = new anchor.web3.VersionedTransaction(messageV0);

    // Step 3 - Sign your transaction with the required `Signers`
    transaction.sign(signers);

    console.log(JSON.stringify(await connection.simulateTransaction(transaction), null, 2));

    // Step 4 - Send our v0 transaction to the cluster
    const txid = await connection.sendTransaction(transaction, {
      maxRetries: 5,
    });
    console.log("   ✅ - Transaction sent to network, tx hash:", txid);

    // Step 5 - Confirm Transaction
    const confirmation = await connection.confirmTransaction(
      {
        signature: txid,
        blockhash: latestBlockhash.blockhash,
        lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
      },
      "finalized"
    );
    if (confirmation.value.err) {
      throw new Error("   ❌ - Transaction not confirmed.");
    }
    console.log("🎉 Transaction succesfully confirmed!", "\n", `https://explorer.solana.com/tx/${txid}?cluster=devnet`);
  } catch (error) {
    console.log("Error:", error);
  }
}

export const GUARDIAN_SET_INDEX = 0;
export const GUARDIAN_KEYS = [
  "cfb12303a19cde580bb4dd771639b0d26bc68353645571a8cff516ab2ee113a0",
  "c3b2e45c422a1602333a64078aeb42637370b0f48fe385f9cfa6ad54a8e0c47e",
  "9f790d3f08bc4b5cd910d4278f3deb406e57bb5e924906ccd52052bb078ccd47",
  "b20cc49d6f2c82a5e6519015fc18aa3e562867f85f872c58f1277cfbd2a0c8e4",
  "eded5a2fdcb5bbbfa5b07f2a91393813420e7ac30a72fc935b6df36f8294b855",
  "00d39587c3556f289677a837c7f3c0817cb7541ce6e38a243a4bdc761d534c5e",
  "da534d61a8da77b232f3a2cee55c0125e2b3e33a5cd8247f3fe9e72379445c3b",
  "cdbabfc2118eb00bc62c88845f3bbd03cb67a9e18a055101588ca9b36387006c",
  "c83d36423820e7350428dc4abe645cb2904459b7d7128adefe16472fdac397ba",
  "1cbf4e1388b81c9020500fefc83a7a81f707091bb899074db1bfce4537428112",
  "17646a6ba14a541957fc7112cc973c0b3f04fce59484a92c09bb45a0b57eb740",
  "eb94ff04accbfc8195d44b45e7c7da4c6993b2fbbfc4ef166a7675a905df9891",
  "053a6527124b309d914a47f5257a995e9b0ad17f14659f90ed42af5e6e262b6a",
  "3fbf1e46f6da69e62aed5670f279e818889aa7d8f1beb7fd730770fd4f8ea3d7",
  "53b05697596ba04067e40be8100c9194cbae59c90e7870997de57337497172e9",
  "4e95cb2ff3f7d5e963631ad85c28b1b79cb370f21c67cbdd4c2ffb0bf664aa06",
  "01b8c448ce2c1d43cfc5938d3a57086f88e3dc43bb8b08028ecb7a7924f4676f",
  "1db31a6ba3bcd54d2e8a64f8a2415064265d291593450c6eb7e9a6a986bd9400",
  "70d8f1c9534a0ab61a020366b831a494057a289441c07be67e4288c44bc6cd5d",
];
export const ETHEREUM_TOKEN_BRIDGE_ADDRESS = "0x0290FB167208Af455bB137780163b7B7a9a10C16";
export const WETH_ADDRESS = "0xDDb64fE46a91D46ee29420539FC25FD07c5FEa3E";
