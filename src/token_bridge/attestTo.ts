import { Algodv2 } from "algosdk";
import { ethers, Overrides } from "ethers";
import { TransactionSignerPair, _submitVAAAlgorand } from "../algorand";
import { BridgeImplementationV2__factory } from "../ethers-contracts";
import { bigIntZero } from "../utils";
import {
  Commitment,
  Connection,
  PublicKey,
  PublicKeyInitData,
  Transaction,
} from "@solana/web3.js";
import { SignedVaa } from "../vaa";
import { createCreateWrappedInstruction } from "../solana/tokenBridge";

export async function attestToEth(
  tokenBridgeAddress: string,
  signer: ethers.Signer,
  signedVAA: Uint8Array,
  tokenAddress: string,
  minAmount: ethers.BigNumberish,
  maxAmount: ethers.BigNumberish,
  transferFee: ethers.BigNumberish,
  redeemFee: ethers.BigNumberish,
  escrow: string,
  network: string,
  sourceFee?: boolean,
  destinationFee?: boolean,
  overrides: Overrides & { from?: string | Promise<string> } = {}
): Promise<ethers.ContractReceipt> {
  const bridge = BridgeImplementationV2__factory.connect(tokenBridgeAddress, signer);
  const finalSourceFee = (typeof sourceFee !== 'undefined') ? sourceFee : ethers.BigNumber.from(transferFee).gt(bigIntZero);
  const finalDestinationFee = (typeof destinationFee !== 'undefined') ? destinationFee : ethers.BigNumber.from(redeemFee).gt(bigIntZero);
  const v = await bridge.receiveAttest(signedVAA, tokenAddress, { min: minAmount, max: maxAmount, transferFee: transferFee, redeemFee: redeemFee, Escrow: escrow, src: finalSourceFee, dest: finalDestinationFee }, network, overrides);
  const receipt = await v.wait();
  return receipt;
}

export async function attestToAlgorand(
  client: Algodv2,
  tokenBridgeId: bigint,
  bridgeId: bigint,
  senderAddr: string,
  attestVAA: Uint8Array,
  assetId: bigint,
  escrowId: bigint,
  minToken: bigint,
  maxToken: bigint,
  transferFee: bigint,
  redeemFee: bigint,
  src: boolean,
  dest: boolean,
): Promise<TransactionSignerPair[]> {
  return await _submitVAAAlgorand(
    client,
    tokenBridgeId,
    bridgeId,
    attestVAA,
    senderAddr,
    assetId,
    minToken,
    maxToken,
    transferFee,
    redeemFee,
    escrowId,
    src,
    dest,
  );
}

export async function attestToSolana(
  connection: Connection,
  bridgeAddress: PublicKeyInitData,
  tokenBridgeAddress: PublicKeyInitData,
  payerAddress: PublicKeyInitData,
  mintPubkey: PublicKeyInitData,
  signedVaa: SignedVaa,
  commitment?: Commitment
): Promise<Transaction> {
  const transaction = new Transaction().add(
    createCreateWrappedInstruction(
      tokenBridgeAddress,
      bridgeAddress,
      payerAddress,
      mintPubkey,
      signedVaa
    )
  );
  const { blockhash } = await connection.getLatestBlockhash(commitment);
  transaction.recentBlockhash = blockhash;
  transaction.feePayer = new PublicKey(payerAddress);
  return transaction;
}