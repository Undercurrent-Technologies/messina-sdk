import * as anchor from "@project-serum/anchor";
import { NATIVE_MINT } from "@solana/spl-token";

import { createRegisterChainInstruction } from "../../../src/solana/tokenBridge";
import {
  TOKEN_BRIDGE_PROGRAM_ID_DEVNET,
  WORMHOLE_PROGRAM_ID_DEVNET,
  createAndSendV0Tx,
} from "../utils";
import { Keypair } from "@solana/web3.js";

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
const emitterAddress = Uint8Array.from(
  Buffer.from(
    "0000000000000000000000008791b20f85e1c4be9dd3eb71df8034d0f09256e0",
    "hex"
  )
);
// End of  Selection
const endpoint = Keypair.generate();
const foreignChainId = 10002;

(async () => {
  const connection = new anchor.web3.Connection(rpc);

  const initIx = createRegisterChainInstruction(
    tokenBridgeProgram,
    wormholeProgram,
    payer.publicKey,
    foreignChainId,
    endpoint.publicKey,
    emitterAddress
  );

  await createAndSendV0Tx(connection, [payer], [initIx]);
  // 4ui4wxKdYRU762FYwWMmMT4N8Dwoxf29hDq5unRnqCwjjxzgfzSUwFRhdCZpq3DLGGy3wdCnWGurEvarGBj2E51W
})();
