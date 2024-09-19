import * as anchor from "@project-serum/anchor";
import { getAssociatedTokenAddressSync, NATIVE_MINT } from "@solana/spl-token";

import { createDepositInstruction } from "../../../src/solana/tokenBridge";
import { createAndSendV0Tx, TOKEN_BRIDGE_PROGRAM_ID_DEVNET, WORMHOLE_PROGRAM_ID_DEVNET } from "../utils";
import { Keypair, PublicKey } from "@solana/web3.js";
import { ParsedTokenTransferVaa } from "../../../src/vaa";

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
const amount = BigInt(1_000);
const from = getAssociatedTokenAddressSync(mint, payer.publicKey);


(async () => {
  const connection = new anchor.web3.Connection(rpc);

  const initIx = createDepositInstruction(
    tokenBridgeProgram,
    mint,
    payer.publicKey,
    from,
    amount
  )

  await createAndSendV0Tx(connection, [payer], [initIx]);
})();
