import { ethers, Overrides } from "ethers";
import {
  attestToAlgorand,
} from ".";
import { Bridge__factory } from "../ethers-contracts";

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
  overrides: Overrides & { from?: string | Promise<string> } = {}
) {
  const bridge = Bridge__factory.connect(tokenBridgeAddress, signer);
  const v = await bridge.updateWrapped(signedVAA, tokenAddress, { min: minAmount, max: maxAmount, transferFee: transferFee, redeemFee: redeemFee, Escrow: escrow }, overrides);
  const receipt = await v.wait();
  return receipt;
}

export const updateAttestToAlgorand = attestToAlgorand;
