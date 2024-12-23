import { Algodv2 } from "algosdk";
import { ethers, Overrides } from "ethers";
import { TransactionSignerPair, _submitVAAAlgorand } from "../algorand";
import { BridgeImplementationV2__factory } from "../ethers-contracts";
import {
  ACCOUNT_SIZE,
  NATIVE_MINT,
  TOKEN_PROGRAM_ID,
  createCloseAccountInstruction,
  createInitializeAccountInstruction,
  createTransferInstruction,
  getMinimumBalanceForRentExemptAccount,
  getMint,
} from "@solana/spl-token";
import {
  Commitment,
  Connection,
  Keypair,
  PublicKey,
  PublicKeyInitData,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import {
  createCompleteTransferNativeInstruction,
  createCompleteTransferWrappedInstruction,
} from "../solana/tokenBridge";
import { isBytes, ParsedVaa, parseVaa, SignedVaa } from "../vaa/wormhole";
import { parseTokenTransferVaa } from "../vaa";
import { CHAIN_ID_SOLANA, MAX_VAA_DECIMALS } from "../utils";
import { createPostVaaInstruction, createVerifySignaturesInstructions } from "../solana/wormhole";
import { buildInstructionsCreateTokenAccount } from "../solana/tokenBridge/instructions/account";

export async function redeemOnEth(
  tokenBridgeAddress: string,
  signer: ethers.Signer,
  signedVAA: Uint8Array,
  network: string,
  overrides: Overrides & { from?: string | Promise<string> } = {}
) {
  const bridge = BridgeImplementationV2__factory.connect(tokenBridgeAddress, signer);
  const v = await bridge.completeTransfer(signedVAA, network, overrides);
  const receipt = await v.wait();
  return receipt;
}


export async function redeemOnEthWithType(
  tokenBridgeAddress: string,
  signer: ethers.Signer,
  signedVAA: Uint8Array,
  messageType: string,
  messagePayload: string,
  network: string,
  overrides: Overrides & { from?: string | Promise<string> } = {}
) {
  const bridge = BridgeImplementationV2__factory.connect(tokenBridgeAddress, signer);
  const v = await bridge.completeTransferWithType(signedVAA, {
    messageType: messageType,
    messagePayload: messagePayload
  }, network, overrides);
  const receipt = await v.wait();
  return receipt;
}


// export async function redeemOnEthNative(
//   tokenBridgeAddress: string,
//   signer: ethers.Signer,
//   signedVAA: Uint8Array,
//   overrides: Overrides & { from?: string | Promise<string> } = {}
// ) {
//   const bridge = BridgeImplementationV2__factory.connect(tokenBridgeAddress, signer);
//   const v = await bridge.completeTransferAndUnwrapETH(signedVAA, overrides);
//   const receipt = await v.wait();
//   return receipt;
// }

/**
 * This basically just submits the VAA to Algorand
 * @param client AlgodV2 client
 * @param tokenBridgeId Token bridge ID
 * @param bridgeId Core bridge ID
 * @param vaa The VAA to be redeemed
 * @param acct Sending account
 * @returns Transaction ID(s)
 */
export async function redeemOnAlgorand(
  client: Algodv2,
  tokenBridgeId: bigint,
  bridgeId: bigint,
  vaa: Uint8Array,
  senderAddr: string
): Promise<TransactionSignerPair[]> {
  return await _submitVAAAlgorand(
    client,
    tokenBridgeId,
    bridgeId,
    vaa,
    senderAddr,
    BigInt(0),
  );
}

export async function redeemAndUnwrapOnSolana(
  connection: Connection,
  bridgeAddress: PublicKeyInitData,
  tokenBridgeAddress: PublicKeyInitData,
  payerAddress: PublicKeyInitData,
  signedVaa: SignedVaa,
  treasuryToken: PublicKeyInitData,
  commitment?: Commitment
) {
  const parsed = parseTokenTransferVaa(signedVaa);
  const targetPublicKey = new PublicKey(parsed.to);
  const targetAmount = await getMint(connection, NATIVE_MINT, commitment).then(
    (info) =>
      parsed.amount * BigInt(Math.pow(10, info.decimals - MAX_VAA_DECIMALS))
  );
  const rentBalance = await getMinimumBalanceForRentExemptAccount(
    connection,
    commitment
  );
  if (Buffer.compare(parsed.tokenAddress, NATIVE_MINT.toBuffer()) != 0) {
    return Promise.reject("tokenAddress != NATIVE_MINT");
  }
  const payerPublicKey = new PublicKey(payerAddress);
  const ancillaryKeypair = Keypair.generate();
  const completeTransferIx = createCompleteTransferNativeInstruction(
    tokenBridgeAddress,
    bridgeAddress,
    payerPublicKey,
    treasuryToken,
    signedVaa
  );

  //This will create a temporary account where the wSOL will be moved
  const createAncillaryAccountIx = SystemProgram.createAccount({
    fromPubkey: payerPublicKey,
    newAccountPubkey: ancillaryKeypair.publicKey,
    lamports: rentBalance, //spl token accounts need rent exemption
    space: ACCOUNT_SIZE,
    programId: TOKEN_PROGRAM_ID,
  });

  //Initialize the account as a WSOL account, with the original payerAddress as owner
  const initAccountIx = createInitializeAccountInstruction(
    ancillaryKeypair.publicKey,
    NATIVE_MINT,
    payerPublicKey
  );

  //Send in the amount of wSOL which we want converted to SOL
  const balanceTransferIx = createTransferInstruction(
    targetPublicKey,
    ancillaryKeypair.publicKey,
    payerPublicKey,
    targetAmount.valueOf()
  );

  //Close the ancillary account for cleanup. Payer address receives any remaining funds
  const closeAccountIx = createCloseAccountInstruction(
    ancillaryKeypair.publicKey, //account to close
    payerPublicKey, //Remaining funds destination
    payerPublicKey //authority
  );

  const { blockhash } = await connection.getLatestBlockhash(commitment);
  const transaction = new Transaction()

  await buildInstructionsCreateTokenAccount(
    connection,
    new PublicKey(payerAddress),
    new PublicKey(payerAddress),
    targetPublicKey,
    NATIVE_MINT,
    transaction
  )
  transaction.recentBlockhash = blockhash;
  transaction.feePayer = payerPublicKey;
  transaction.add(
    completeTransferIx,
    createAncillaryAccountIx,
    initAccountIx,
    balanceTransferIx,
    closeAccountIx,
  );
  transaction.partialSign(ancillaryKeypair);
  return transaction;
}

export async function postSignedVaaSolanaTransactions(
  connection: Connection,
  wormholeProgramId: PublicKeyInitData,
  payer: PublicKeyInitData,
  vaa: SignedVaa | ParsedVaa,
  commitment?: Commitment
) {
  const parsed = isBytes(vaa) ? parseVaa(vaa) : vaa;
  const signatureSet = Keypair.generate();

  const unsignedTransactions: Transaction[] = [];

  const verifySignaturesInstructions = await createVerifySignaturesInstructions(
    connection,
    wormholeProgramId,
    payer,
    parsed,
    signatureSet.publicKey,
    commitment
  );

  for(let i=0; i<verifySignaturesInstructions.length; i += 2) {
    unsignedTransactions.push(
      new Transaction().add(...verifySignaturesInstructions.slice(i, i + 2))
    );
  }

  unsignedTransactions.push(
    new Transaction().add(
      createPostVaaInstruction(
        wormholeProgramId,
        payer,
        parsed,
        signatureSet.publicKey
      )
    )
  );

  for(let i=0; i<unsignedTransactions.length; i++) {
    const { blockhash } = await connection.getLatestBlockhash(commitment);

    unsignedTransactions[i].recentBlockhash = blockhash;
    unsignedTransactions[i].feePayer = new PublicKey(payer);
    if(i !== unsignedTransactions.length - 1) {
      unsignedTransactions[i].partialSign(...[signatureSet]);
    }
  }

  return unsignedTransactions
}

export async function redeemOnSolana(
  connection: Connection,
  bridgeAddress: PublicKeyInitData,
  tokenBridgeAddress: PublicKeyInitData,
  payerAddress: PublicKeyInitData,
  signedVaa: SignedVaa,
  treasuryAdress?: PublicKeyInitData,
  mint?: PublicKeyInitData, 
  feeRecipientAddress?: PublicKeyInitData,
  commitment?: Commitment
) {
  const parsed = parseTokenTransferVaa(signedVaa);
  const vaa = Buffer.from(
    signedVaa as unknown as string,
    "hex"
  );
  let transaction = new Transaction()

  await buildInstructionsCreateTokenAccount(
    connection,
    new PublicKey(payerAddress),
    new PublicKey(payerAddress),
    new PublicKey(parsed.to),
    new PublicKey(mint),
    transaction
  )

  if(parsed.tokenChain == CHAIN_ID_SOLANA) {
    transaction = transaction.add(
      createCompleteTransferNativeInstruction(
        tokenBridgeAddress,
        bridgeAddress,
        payerAddress,
        treasuryAdress,
        parsed,
        feeRecipientAddress
      )
    );
  } else {
    transaction = transaction.add(
      createCompleteTransferWrappedInstruction(
        tokenBridgeAddress,
        bridgeAddress,
        payerAddress,
        treasuryAdress,
        vaa,
        mint,
        feeRecipientAddress
      )
    ); 
  }
  const { blockhash } = await connection.getLatestBlockhash(commitment);
  transaction.recentBlockhash = blockhash;
  transaction.feePayer = new PublicKey(payerAddress);
  return transaction;
}