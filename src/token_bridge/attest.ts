import algosdk, {
  Algodv2,
  bigIntToBytes,
  decodeAddress,
  getApplicationAddress,
  makeApplicationCallTxnFromObject,
  makePaymentTxnWithSuggestedParamsFromObject,
  OnApplicationComplete,
  SuggestedParams,
} from "algosdk";
import { ethers, PayableOverrides } from "ethers";
import { getMessageFee, optin, TransactionSignerPair } from "../algorand";
import { BridgeImplementationV2__factory } from "../ethers-contracts";
import { ChainId, textToHexString, textToUint8Array, uint8ArrayToHex } from "../utils";
import { bigIntZero, safeBigIntToNumber } from "../utils/bigint";
import { createNonce } from "../utils/createNonce";
import {
  Commitment,
  Connection,
  Keypair,
  PublicKey,
  PublicKeyInitData,
  Transaction,
} from "@solana/web3.js";
import { createBridgeFeeTransferInstruction } from "../solana";
import { createAttestTokenInstruction, TokenConfigData } from "../solana/tokenBridge";
import { Types } from "aptos";
import { attestToken as attestTokenAptos } from "../aptos";

export async function attestFromEth(
  tokenBridgeAddress: string,
  signer: ethers.Signer,
  tokenAddress: string,
  minAmount: ethers.BigNumberish,
  maxAmount: ethers.BigNumberish,
  transferFee: ethers.BigNumberish,
  redeemFee: ethers.BigNumberish,
  escrow: string,
  network: string,
  sourceFee?: boolean,
  destinationFee?: boolean,
  overrides: PayableOverrides & { from?: string | Promise<string> } = {}
): Promise<ethers.ContractReceipt> {
  const bridge = BridgeImplementationV2__factory.connect(tokenBridgeAddress, signer);
  const finalSourceFee = (typeof sourceFee !== 'undefined') ? sourceFee : ethers.BigNumber.from(transferFee).gt(bigIntZero);
  const finalDestinationFee = (typeof destinationFee !== 'undefined') ? destinationFee : ethers.BigNumber.from(redeemFee).gt(bigIntZero);
  const v = await bridge.attestToken(tokenAddress, createNonce(), { min: minAmount, max: maxAmount, transferFee: transferFee, redeemFee: redeemFee, Escrow: escrow, src: finalSourceFee, dest: finalDestinationFee }, network, overrides);
  const receipt = await v.wait();
  return receipt;
}

/**
 * Attest an already created asset
 * If you create a new asset on algorand and want to transfer it elsewhere,
 * you create an attestation for it on algorand... pass that vaa to the target chain..
 * submit it.. then you can transfer from algorand to that target chain
 * @param client An Algodv2 client
 * @param tokenBridgeId The ID of the token bridge
 * @param senderAcct The account paying fees
 * @param assetId The asset index
 * @param minToken The minimum amount the bridge can transfer/redeem
 * @param maxToken The maximum amount the bridge can transfer/redeem
 * @param transferFee The percentage of transferring fee (0 means no transfer fee)
 * @param redeemFee The percentage of redeeming fee (0 means no redeem fee)
 * @returns Transaction ID
 */
export async function attestFromAlgorand(
  client: Algodv2,
  tokenBridgeId: bigint,
  bridgeId: bigint,
  senderAddr: string,
  assetId: bigint,
  escrowId: bigint,
  minToken: bigint,
  maxToken: bigint,
  transferFee: bigint,
  redeemFee: bigint,
  src: boolean,
  dest: boolean,
): Promise<TransactionSignerPair[]> {
  const tbAddr: string = getApplicationAddress(tokenBridgeId);
  const decTbAddr: Uint8Array = decodeAddress(tbAddr).publicKey;
  const aa: string = uint8ArrayToHex(decTbAddr);
  const txs: TransactionSignerPair[] = [];
  // "attestFromAlgorand::emitterAddr"
  const { addr: emitterAddr, txs: emitterOptInTxs } = await optin(
    client,
    senderAddr,
    bridgeId,
    BigInt(0),
    aa
  );
  txs.push(...emitterOptInTxs);
  let wormhole: boolean = false;
  let creatorAcctInfo: any = false;
  let creatorAddr = "";
  const bPgmName: Uint8Array = textToUint8Array("attestToken");

  if (assetId !== BigInt(0)) {
    const assetInfo = await client
      .getAssetByID(safeBigIntToNumber(assetId))
      .do();
    const creatorAddr = assetInfo.params.creator;
    creatorAcctInfo = await client.accountInformation(creatorAddr).do();
    wormhole = creatorAcctInfo["auth-addr"] === tbAddr;
  } else {
    wormhole = false;
  }

  if (!wormhole) {
    // "notWormhole"
    const result = await optin(
      client,
      senderAddr,
      tokenBridgeId,
      assetId,
      textToHexString("native")
    );
    creatorAddr = result.addr;
    txs.push(...result.txs);
  }
  const suggParams: SuggestedParams = await client.getTransactionParams().do();

  const firstTxn = makeApplicationCallTxnFromObject({
    from: senderAddr,
    appIndex: safeBigIntToNumber(tokenBridgeId),
    onComplete: OnApplicationComplete.NoOpOC,
    appArgs: [textToUint8Array("nop")],
    suggestedParams: suggParams,
  });
  txs.push({ tx: firstTxn, signer: null });

  let buf: Uint8Array = new Uint8Array(1);
  buf[0] = 0x02;
  const secondNopTxn = makeApplicationCallTxnFromObject({
    from: senderAddr,
    appIndex: safeBigIntToNumber(tokenBridgeId),
    onComplete: OnApplicationComplete.NoOpOC,
    appArgs: [textToUint8Array("nop"), buf],
    suggestedParams: suggParams,
  });
  txs.push({ tx: secondNopTxn, signer: null });

  const mfee = await getMessageFee(client, bridgeId);
  if (mfee > BigInt(0)) {
    const feeTxn = makePaymentTxnWithSuggestedParamsFromObject({
      from: senderAddr,
      suggestedParams: suggParams,
      to: getApplicationAddress(tokenBridgeId),
      amount: mfee,
    });
    txs.push({ tx: feeTxn, signer: null });
  }

  let accts: string[] = [
    emitterAddr,
    creatorAddr,
    getApplicationAddress(bridgeId),
  ];

  if (creatorAcctInfo) {
    accts.push(creatorAcctInfo["address"]);
  }

  let appTxn = makeApplicationCallTxnFromObject({
    appArgs: [
      bPgmName,
      bigIntToBytes(assetId, 8),
      algosdk.encodeUint64(minToken),
      algosdk.encodeUint64(maxToken),
      algosdk.encodeUint64(transferFee),
      algosdk.encodeUint64(redeemFee),
      algosdk.encodeUint64(escrowId),
      algosdk.encodeUint64(BigInt(src)),
      algosdk.encodeUint64(BigInt(dest)),
    ],
    accounts: accts,
    appIndex: safeBigIntToNumber(tokenBridgeId),
    foreignApps: [safeBigIntToNumber(bridgeId)],
    foreignAssets: [safeBigIntToNumber(assetId)],
    from: senderAddr,
    onComplete: OnApplicationComplete.NoOpOC,
    suggestedParams: suggParams,
  });
  if (mfee > BigInt(0)) {
    appTxn.fee *= 3;
  } else {
    appTxn.fee *= 2;
  }
  txs.push({ tx: appTxn, signer: null });

  return txs;
}

export async function createLogicSigForAttestFromEthToAlgo(
  client: Algodv2,
  tokenBridgeId: bigint,
  bridgeId: bigint,
  senderAddr: string,
): Promise<TransactionSignerPair[]> {
  const tbAddr: string = getApplicationAddress(tokenBridgeId);
  const decTbAddr: Uint8Array = decodeAddress(tbAddr).publicKey;
  const aa: string = uint8ArrayToHex(decTbAddr);

  const { txs: emitterOptInTxs } = await optin(
    client,
    senderAddr,
    bridgeId,
    BigInt(0),
    aa
  );

  return emitterOptInTxs;
}

/**
 * Attest an already created asset
 * If you create a new asset on algorand and want to transfer it elsewhere,
 * you create an attestation for it on algorand... pass that vaa to the target chain..
 * submit it.. then you can transfer from algorand to that target chain
 * @param client An Algodv2 client
 * @param tokenBridgeId The ID of the token bridge
 * @param senderAcct The account paying fees
 * @param assetId The asset index
 * @param minToken The minimum amount the bridge can transfer/redeem
 * @param maxToken The maximum amount the bridge can transfer/redeem
 * @param transferFee The percentage of transferring fee (0 means no transfer fee)
 * @param redeemFee The percentage of redeeming fee (0 means no redeem fee)
 * @returns Transaction ID
 */
export async function attestFromNFTAlgorand(
  client: Algodv2,
  tokenBridgeId: bigint,
  bridgeId: bigint,
  senderAddr: string,
  assetId: bigint,
  escrowId: bigint,
): Promise<TransactionSignerPair[]> {
  const tbAddr: string = getApplicationAddress(tokenBridgeId);
  const decTbAddr: Uint8Array = decodeAddress(tbAddr).publicKey;
  const aa: string = uint8ArrayToHex(decTbAddr);
  const txs: TransactionSignerPair[] = [];
  // "attestFromAlgorand::emitterAddr"
  const { addr: emitterAddr, txs: emitterOptInTxs } = await optin(
    client,
    senderAddr,
    bridgeId,
    BigInt(0),
    aa
  );
  txs.push(...emitterOptInTxs);
  let wormhole: boolean = false;
  let creatorAcctInfo: any = false;
  let creatorAddr = "";
  const bPgmName: Uint8Array = textToUint8Array("attestToken");

  if (assetId !== BigInt(0)) {
    const assetInfo = await client
      .getAssetByID(safeBigIntToNumber(assetId))
      .do();
    const creatorAddr = assetInfo.params.creator;
    creatorAcctInfo = await client.accountInformation(creatorAddr).do();
    wormhole = creatorAcctInfo["auth-addr"] === tbAddr;
  } else {
    wormhole = false;
  }

  if (!wormhole) {
    // "notWormhole"
    const result = await optin(
      client,
      senderAddr,
      tokenBridgeId,
      assetId,
      textToHexString("native")
    );
    creatorAddr = result.addr;
    txs.push(...result.txs);
  }
  const suggParams: SuggestedParams = await client.getTransactionParams().do();

  const firstTxn = makeApplicationCallTxnFromObject({
    from: senderAddr,
    appIndex: safeBigIntToNumber(tokenBridgeId),
    onComplete: OnApplicationComplete.NoOpOC,
    appArgs: [textToUint8Array("nop")],
    suggestedParams: suggParams,
  });
  txs.push({ tx: firstTxn, signer: null });

  let buf: Uint8Array = new Uint8Array(1);
  buf[0] = 0x02;
  const secondNopTxn = makeApplicationCallTxnFromObject({
    from: senderAddr,
    appIndex: safeBigIntToNumber(tokenBridgeId),
    onComplete: OnApplicationComplete.NoOpOC,
    appArgs: [textToUint8Array("nop"), buf],
    suggestedParams: suggParams,
  });
  txs.push({ tx: secondNopTxn, signer: null });

  const mfee = await getMessageFee(client, bridgeId);
  if (mfee > BigInt(0)) {
    const feeTxn = makePaymentTxnWithSuggestedParamsFromObject({
      from: senderAddr,
      suggestedParams: suggParams,
      to: getApplicationAddress(tokenBridgeId),
      amount: mfee,
    });
    txs.push({ tx: feeTxn, signer: null });
  }

  let accts: string[] = [
    emitterAddr,
    creatorAddr,
    getApplicationAddress(bridgeId),
  ];

  if (creatorAcctInfo) {
    accts.push(creatorAcctInfo["address"]);
  }

  let appTxn = makeApplicationCallTxnFromObject({
    appArgs: [
      bPgmName,
      bigIntToBytes(assetId, 8),
      // algosdk.encodeUint64(minToken),
      // algosdk.encodeUint64(maxToken),
      // algosdk.encodeUint64(transferFee),
      // algosdk.encodeUint64(redeemFee),
      algosdk.encodeUint64(escrowId),
      // algosdk.encodeUint64(BigInt(src)),
      // algosdk.encodeUint64(BigInt(dest)),
    ],
    accounts: accts,
    appIndex: safeBigIntToNumber(tokenBridgeId),
    foreignApps: [safeBigIntToNumber(bridgeId)],
    foreignAssets: [safeBigIntToNumber(assetId)],
    from: senderAddr,
    onComplete: OnApplicationComplete.NoOpOC,
    suggestedParams: suggParams,
  });
  if (mfee > BigInt(0)) {
    appTxn.fee *= 3;
  } else {
    appTxn.fee *= 2;
  }
  txs.push({ tx: appTxn, signer: null });

  return txs;
}

export async function attestFromSolana(
  connection: Connection,
  bridgeAddress: PublicKeyInitData,
  tokenBridgeAddress: PublicKeyInitData,
  payerAddress: PublicKeyInitData,
  mintAddress: PublicKeyInitData,
  tokenConfigData: TokenConfigData,
  commitment?: Commitment,
): Promise<Transaction> {
  const nonce = createNonce().readUInt32LE(0);
  const transferIx = await createBridgeFeeTransferInstruction(
    connection,
    bridgeAddress,
    payerAddress
  );
  const messageKey = Keypair.generate();
  const attestIx = createAttestTokenInstruction(
    tokenBridgeAddress,
    bridgeAddress,
    payerAddress,
    mintAddress,
    messageKey.publicKey,
    nonce,
    tokenConfigData,
  );
  const transaction = new Transaction().add(transferIx, attestIx);
  const { blockhash } = await connection.getLatestBlockhash(commitment);
  transaction.recentBlockhash = blockhash;
  transaction.feePayer = new PublicKey(payerAddress);
  transaction.partialSign(messageKey);
  return transaction;
}

/**
 * Attest given token from Aptos.
 * @param tokenBridgeAddress Address of token bridge
 * @param tokenChain Origin chain ID
 * @param tokenAddress Address of token on origin chain
 * @returns Transaction payload
 */
export function attestFromAptos(
  tokenBridgeAddress: string,
  tokenChain: ChainId,
  tokenAddress: string,
  transferFee: string,
  redeemFee: string,
  min: string,
  max: string,
  src: boolean,
  dest: boolean,
): Types.EntryFunctionPayload {
  return attestTokenAptos(
    tokenBridgeAddress,
    tokenChain,
    tokenAddress,
    transferFee,
    redeemFee,
    min,
    max,
    src,
    dest,
  );
}
