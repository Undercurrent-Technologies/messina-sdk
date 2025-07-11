import { ethers, Overrides } from "ethers";
import { NFTBridge__factory } from "../ethers-contracts";
import { Types } from "aptos";
import { parseNftTransferVaa } from "../vaa";
import { CHAIN_ID_APTOS } from "../utils";

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

export const completeTransferNFT = async (
  tokenBridgeAddress: string,
  transferVAA: Uint8Array,
): Promise<Types.EntryFunctionPayload> => {
  if (!tokenBridgeAddress) throw new Error("Need token bridge address.");

  return {
    function: `${tokenBridgeAddress}::complete_transfer::submit_vaa_entry`,
    type_arguments: [],
    arguments: [transferVAA],
  };
};