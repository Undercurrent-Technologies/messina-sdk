import { ethers, Overrides } from "ethers";
import {
  attestToAlgorand,
} from ".";
import { BridgeImplementationV2__factory } from "../ethers-contracts";
import { bigIntZero } from "../utils";

export async function updateAttestToEth(
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
) {
  const bridge = BridgeImplementationV2__factory.connect(tokenBridgeAddress, signer);

  const finalSourceFee = (typeof sourceFee !== 'undefined') ? sourceFee : ethers.BigNumber.from(transferFee).gt(bigIntZero);
  const finalDestinationFee = (typeof destinationFee !== 'undefined') ? destinationFee : ethers.BigNumber.from(redeemFee).gt(bigIntZero);
  const v = await bridge.updateAttested(signedVAA, tokenAddress, { min: minAmount, max: maxAmount, transferFee: transferFee, redeemFee: redeemFee, Escrow: escrow, src: finalSourceFee, dest: finalDestinationFee }, network, overrides);
  const receipt = await v.wait();
  return receipt;
}

export const updateAttestToAlgorand = attestToAlgorand;
