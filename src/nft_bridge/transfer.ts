import { ethers, Overrides } from "ethers";
import { ChainId, ChainName, createNonce } from "../utils";

export async function transferFromEth(
  nftBridge: ethers.Contract,
  nftAddr: string,
  tokenIDs: ethers.BigNumberish[],
  recipientChainId: ChainId | ChainName,
  recipientAddress: Uint8Array,
  tokenAmounts: number[],
  etherAmount: ethers.BigNumber,
  overrides: Overrides & { from?: string | Promise<string> } = {}
): Promise<ethers.ContractReceipt> {
  const v = await nftBridge.transferNFT(
    nftAddr,
    tokenIDs,
    recipientChainId,
    recipientAddress,
    createNonce(),
    tokenAmounts,
    {
      ...overrides,
      value: etherAmount
    }
  );
  const receipt = await v.wait();
  return receipt;
}
