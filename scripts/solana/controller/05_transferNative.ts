import * as anchor from "@project-serum/anchor";
import {
  createApproveInstruction,
  createAssociatedTokenAccount,
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddressSync,
  NATIVE_MINT,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";

import {
  createApproveAuthoritySignerInstruction,
  createAttestTokenInstruction,
  createTransferNativeInstruction,
  TokenConfigData,
} from "../../../src/solana/tokenBridge";
import {
  TOKEN_BRIDGE_PROGRAM_ID_DEVNET,
  WORMHOLE_PROGRAM_ID_DEVNET,
  buildInstructionsWrapSol,
  createAndSendV0Tx,
} from "../utils";
import { Keypair, PublicKey } from "@solana/web3.js";

const rpc = "https://api.devnet.solana.com";
const tokenBridgeProgram = new anchor.web3.PublicKey(TOKEN_BRIDGE_PROGRAM_ID_DEVNET);
const wormholeProgram = new anchor.web3.PublicKey(WORMHOLE_PROGRAM_ID_DEVNET);
const payer = anchor.web3.Keypair.fromSecretKey(
  Uint8Array.from([
    194, 57, 147, 171, 158, 133, 124, 226, 120, 25, 187, 215, 255, 203, 10, 105, 2, 191, 114, 171, 47, 241, 53, 231, 59,
    105, 107, 92, 172, 195, 64, 94, 66, 20, 14, 141, 118, 72, 8, 221, 36, 254, 243, 251, 144, 19, 240, 48, 252, 132,
    173, 223, 250, 90, 66, 105, 140, 131, 50, 90, 132, 202, 54, 216,
  ])
);
const mint = NATIVE_MINT;
// const mint = new PublicKey("3vk3cnws4m6s2uW3xDXW3jQWgu1oTxuA1spmTzxDKt9F");
const message = Keypair.generate();
const nonce = 0;
const from = getAssociatedTokenAddressSync(mint, payer.publicKey, true, TOKEN_PROGRAM_ID);
const treasury = payer.publicKey;
const treasuryToken = getAssociatedTokenAddressSync(mint, treasury);
const amount = BigInt(1_000);
const fee = BigInt(0);
const targetAddress = PublicKey.default.toBytes();
const targetChain = 2;

console.log("from.base58()", from.toBase58());

(async () => {
  const connection = new anchor.web3.Connection(rpc);

  const wsolIx = await buildInstructionsWrapSol(connection, payer.publicKey, payer.publicKey, Number(amount));

  const approveIx = createApproveAuthoritySignerInstruction(tokenBridgeProgram, from, payer.publicKey, Number(amount));

  const initIx = createTransferNativeInstruction(
    tokenBridgeProgram,
    wormholeProgram,
    payer.publicKey,
    message.publicKey,
    from,
    mint,
    treasury,
    treasuryToken,
    nonce,
    amount,
    fee,
    targetAddress,
    targetChain
  );

  await createAndSendV0Tx(connection, [payer, message], [...wsolIx, approveIx, initIx]);
  // 3mjRkwrQxBV3LY4UDBczeiwowDj2FsnN6vPro5QiFpzZi9ZDWzyZqKAfFQ2WMtybie6NjUJeosXS1dab2Aui1v8g
})();
