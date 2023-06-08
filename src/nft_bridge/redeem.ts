import { ethers, Overrides } from "ethers";
import { NFTBridge__factory } from "../ethers-contracts";

export async function redeemOnEthNFT(
  tokenBridgeAddress: string,
  signer: ethers.Signer,
  signedVAA: Uint8Array,
  network: string,
  overrides: Overrides & { from?: string | Promise<string> } = {}
): Promise<ethers.ContractReceipt> {
  const bridge = NFTBridge__factory.connect(tokenBridgeAddress, signer);
  const v = await bridge.completeTransfer(signedVAA, network, overrides);
  const receipt = await v.wait();
  return receipt;
}
