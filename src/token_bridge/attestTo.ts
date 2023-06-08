import { Algodv2 } from "algosdk";
import { ethers, Overrides } from "ethers";
import { TransactionSignerPair, _submitVAAAlgorand } from "../algorand";
import { Bridge__factory } from "../ethers-contracts";
import { bigIntZero } from "../utils";

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
  const bridge = Bridge__factory.connect(tokenBridgeAddress, signer);
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
