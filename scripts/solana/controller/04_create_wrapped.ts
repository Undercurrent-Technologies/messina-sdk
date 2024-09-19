import * as anchor from "@project-serum/anchor";
import {
  MINT_SIZE,
  TOKEN_PROGRAM_ID,
  createInitializeMintInstruction,
  getMinimumBalanceForRentExemptMint,
} from "@solana/spl-token";

import { createCreateWrappedInstruction } from "../../../src/solana/tokenBridge";
import {
  ETHEREUM_TOKEN_BRIDGE_ADDRESS,
  GUARDIAN_KEYS,
  GUARDIAN_SET_INDEX,
  TOKEN_BRIDGE_PROGRAM_ID_DEVNET,
  WETH_ADDRESS,
  WORMHOLE_PROGRAM_ID_DEVNET,
  createAndSendV0Tx,
} from "../utils";
import { Keypair, SystemProgram } from "@solana/web3.js";
import { findMetadataPda } from "@metaplex-foundation/js";
import { createCreateMetadataAccountV3Instruction } from "@metaplex-foundation/mpl-token-metadata";
import { MockEthereumTokenBridge, MockGuardians } from "../../../src/mock";
import { createPostSignedVaaTransactions } from "../../../src/solana/sendAndConfirmPostVaa";
import { createPostVaaInstruction } from "../../../src/solana/wormhole";
import { PreparedTransactions, SignTransaction } from "../../../src/solana/utils";
import { postVaa } from "../../../src/solana/sendAndConfirmPostVaa";

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

const mintKeypair = Keypair.generate();

// for signing wormhole messages
const guardians = new MockGuardians(GUARDIAN_SET_INDEX + 1, GUARDIAN_KEYS);
const ethereumTokenBridge = new MockEthereumTokenBridge(ETHEREUM_TOKEN_BRIDGE_ADDRESS);

const tokenAddress = WETH_ADDRESS;
const decimals = 18;
const symbol = "WETH";
const name = "Wrapped ETH";
const nonce = 420;
const message = ethereumTokenBridge.publishAttestMeta(tokenAddress, decimals, symbol, name, nonce);

(async () => {
  const connection = new anchor.web3.Connection(rpc);
  const vaa = Buffer.from(
    "0100000000010041375974231098e80ee8747a7b4251c42adfbf5658a499f712682c54af35f91b4a0479248798855414dffbbf50639f443a0417e21a4cb71c0685aad7d0b0364d006672acc84b52010027120000000000000000000000008791b20f85e1c4be9dd3eb71df8034d0f09256e0000000000000004fc802000000000000000000000000af536d6897ece61770bc0c3dd8477d64132e233b00021274740000000000000000000000000000000000000000000000000000000000007474000000000000000000000000000000000000000000000000000000000000",
    "hex"
  );

  // const res = await postVaa(
  //   connection,
  //   (transaction) => {
  //     transaction.partialSign(payer);
  //     return Promise.resolve(transaction);
  //   },
  //   wormholeProgram,
  //   payer.publicKey,
  //   vaa
  // );

  const createMintIxs = [
    SystemProgram.createAccount({
      fromPubkey: payer.publicKey,
      newAccountPubkey: mintKeypair.publicKey,
      space: MINT_SIZE,
      lamports: await getMinimumBalanceForRentExemptMint(connection),
      programId: TOKEN_PROGRAM_ID,
    }),
    createInitializeMintInstruction(
      mintKeypair.publicKey, //Mint Address
      8, //Number of Decimals of New mint
      payer.publicKey, //Mint Authority
      null, //Freeze Authority
      TOKEN_PROGRAM_ID
    ),
    createCreateMetadataAccountV3Instruction(
      {
        metadata: findMetadataPda(mintKeypair.publicKey),
        mint: mintKeypair.publicKey,
        mintAuthority: payer.publicKey,
        payer: payer.publicKey,
        updateAuthority: payer.publicKey,
      },
      {
        createMetadataAccountArgsV3: {
          data: {
            name: "Wrapped ether",
            symbol: "WETH",
            uri: "TO_UPDATE_LATER",
            sellerFeeBasisPoints: 0,
            creators: null,
            collection: null,
            uses: null,
          },
          isMutable: true,
          collectionDetails: null,
        },
      }
    ),
  ];

  // console.log("res: ", res);
  const initIx = createCreateWrappedInstruction(
    tokenBridgeProgram,
    wormholeProgram,
    payer.publicKey,
    mintKeypair.publicKey,
    vaa
  );

  await createAndSendV0Tx(connection, [payer, mintKeypair], [...createMintIxs, initIx]);
  // 4vsEjFhx8cM4h3equktwbghz5MK36geQC2cwiK22z3EZ8PAqpB4vTC1GZXXo6dEoG8gaavJywTnzGfB4gg9Ef5ip
})();
