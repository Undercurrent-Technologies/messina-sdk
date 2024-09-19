import * as anchor from "@project-serum/anchor";
import { NATIVE_MINT } from "@solana/spl-token";

import {
  createInitializeInstruction,
  createAttestTokenInstruction,
  TokenConfigData,
} from "../../../src/solana/tokenBridge";
import {
  TOKEN_BRIDGE_PROGRAM_ID_DEVNET,
  WORMHOLE_PROGRAM_ID_DEVNET,
  createAndSendV0Tx,
} from "../utils";
import { Keypair, PublicKey } from "@solana/web3.js";

const rpc = "https://api.devnet.solana.com";
const tokenBridgeProgram = new anchor.web3.PublicKey(
  TOKEN_BRIDGE_PROGRAM_ID_DEVNET
);
const wormholeProgram = new anchor.web3.PublicKey(WORMHOLE_PROGRAM_ID_DEVNET);
const payer = anchor.web3.Keypair.fromSecretKey(
  Uint8Array.from([
    194, 57, 147, 171, 158, 133, 124, 226, 120, 25, 187, 215, 255, 203, 10, 105,
    2, 191, 114, 171, 47, 241, 53, 231, 59, 105, 107, 92, 172, 195, 64, 94, 66,
    20, 14, 141, 118, 72, 8, 221, 36, 254, 243, 251, 144, 19, 240, 48, 252, 132,
    173, 223, 250, 90, 66, 105, 140, 131, 50, 90, 132, 202, 54, 216,
  ])
);
// const mint = NATIVE_MINT;
const mint = new PublicKey("2CdMVY9cSAJdMa1yztrKYSyXCfYipmsj4xHXBHRwHj2J");
const message = Keypair.generate();
const nonce = 0;
const tokenConfigData: TokenConfigData = {
  escrowAddress: payer.publicKey,
  transferFee: BigInt(0),
  redeemFee: BigInt(0),
  min: BigInt(0),
  max: BigInt(1_000_000_000_000_000),
  src: false,
  dst: true,
  w1: payer.publicKey,
  w2: payer.publicKey,
};

(async () => {
  const connection = new anchor.web3.Connection(rpc);

  const initIx = createAttestTokenInstruction(
    tokenBridgeProgram,
    wormholeProgram,
    payer.publicKey,
    mint,
    message.publicKey,
    nonce,
    tokenConfigData
  );

  await createAndSendV0Tx(connection, [payer, message], [initIx]);
  // eUhwxY5Qkq9Bf1PoxhJe6vCUHiqUMzk6pV3qmSaYwHHmrAogVYBnLDoX3PTxHfuPPqzKvbgpSfztJZi9ncRmwz8
})();
