import { ethers, Overrides } from "ethers";
import { CHAIN_ID_ALGORAND, ChainId, ChainName, createNonce } from "../utils";
import {
  NFT1155Implementation__factory,
  NFTBridge__factory,
  NFTImplementation__factory,
} from "../ethers-contracts";
import { getEmitterAddressEth } from "../bridge/getEmitterAddress";

export async function transferFromEth(
  nftBridge: ethers.Contract,
  nftAddr: string,
  tokenIDs: ethers.BigNumberish[],
  recipientChainId: ChainId | ChainName,
  recipientAddress: Uint8Array,
  tokenAmounts: number[],
  etherAmount: ethers.BigNumber,
  network: string,
  overrides: Overrides & { from?: string | Promise<string> } = {}
): Promise<ethers.ContractReceipt> {
  const v = await nftBridge.transferNFT(
    nftAddr,
    tokenIDs,
    recipientChainId,
    recipientAddress,
    createNonce(),
    tokenAmounts,
    network,
    {
      ...overrides,
      value: etherAmount
    },
  );
  const receipt = await v.wait();
  return receipt;
}

export async function transferFromEthNFT(
  nftBridgeAddress: string,
  signer: ethers.Signer,
  tokenAddress: string,
  tokenIDs: ethers.BigNumberish[],
  recipientChainId: ChainId | ChainName,
  recipientAddress: Uint8Array,
  tokenAmounts: number[],
  etherAmount: ethers.BigNumber,
  network: string,
  overrides: Overrides & { from?: string | Promise<string> } = {}
): Promise<ethers.ContractReceipt> {
  const bridge = NFTBridge__factory.connect(nftBridgeAddress, signer);
  const v = await bridge.transferNFT(
    tokenAddress,
    tokenIDs,
    recipientChainId,
    recipientAddress,
    createNonce(),
    tokenAmounts,
    network,
    {
      ...overrides,
      value: etherAmount
    },
  );
  const receipt = await v.wait();
  return receipt;
}

export async function approveEthNFT(
  tokenBridgeAddress: string,
  signer: ethers.Signer,
  tokenAddress: string,
  tokenID: ethers.BigNumberish,
  overrides: Overrides & { from?: string | Promise<string> } = {}
): Promise<ethers.ContractReceipt> {
  //TODO: should we check if token attestation exists on the target chain
  const token = NFTImplementation__factory.connect(tokenAddress, signer);
  const v = await token.approve(tokenBridgeAddress, tokenID, overrides);
  const receipt = await v.wait();
  return receipt;
}

export async function getApprovedEthNFT(
  signer: ethers.Signer,
  tokenAddress: string,
  tokenID: ethers.BigNumberish,
  overrides: Overrides & { from?: string | Promise<string> } = {}
): Promise<string> {
  const token = NFTImplementation__factory.connect(tokenAddress, signer);
  const approvedAddr = await token.getApproved(tokenID, overrides);

  return approvedAddr;
}

export async function setApprovalForAllEthNFT(
  tokenBridgeAddress: string,
  signer: ethers.Signer,
  tokenAddress: string,
  isApproved: boolean,
  NFTType: "ERC721" | "ERC1155",
  overrides: Overrides & { from?: string | Promise<string> } = {}
): Promise<ethers.ContractReceipt> {
  //TODO: should we check if token attestation exists on the target chain
  const token = NFTType === "ERC721" ? NFTImplementation__factory.connect(tokenAddress, signer) : NFT1155Implementation__factory.connect(tokenAddress, signer);
  const v = await token.setApprovalForAll(tokenBridgeAddress, isApproved, overrides);
  const receipt = await v.wait();
  return receipt;
}

export async function getIsApprovedForAllEthNFT(
  tokenBridgeAddress: string,
  signer: ethers.Signer,
  tokenAddress: string,
  NFTType: "ERC721" | "ERC1155",
  overrides: Overrides & { from?: string | Promise<string> } = {}
): Promise<boolean> {
  const signerAddr = await signer.getAddress();
  const token = NFTType === "ERC721" ? NFTImplementation__factory.connect(tokenAddress, signer) : NFT1155Implementation__factory.connect(tokenAddress, signer);
  const approved = await token.isApprovedForAll(signerAddr, tokenBridgeAddress, overrides);

  return approved;
}


export const getWrappedAddrNFT = async (
  nftBridgeAddress: string,
  originChainIdHex: string,
  originNFTAddr: string,
  signer: ethers.Signer | ethers.providers.Provider,
): Promise<string> => {
  const nftBridge = NFTBridge__factory.connect(nftBridgeAddress, signer);

  const originNFTAddrB32 = getEmitterAddressEth(originNFTAddr)
  const wrappedAddr = await nftBridge.wrappedAsset(
    originChainIdHex,
    '0x' + originNFTAddrB32,
  )

  return wrappedAddr
}

export const getEvmWrappedAddress = async (
  collectionAddress: number,
  nftBridgeAddress: string,
  signer: ethers.Signer | ethers.providers.Provider,
): Promise<string> => {
  const collectionAddressNumber = Number(collectionAddress);
  const hexString = collectionAddressNumber.toString(16);
  const paddingLength = 64 - hexString.length;
  const padding = new Array(paddingLength + 1).join('0'); // Creates a string of repeated '0's
  const paddedHex = '0x' + padding + hexString;
  const algoNativeAddressB32 = '0x' + ethers.utils.hexZeroPad(paddedHex, 32).slice(2)
  const nftBridge = NFTBridge__factory.connect(nftBridgeAddress, signer);
  const wrappedAddr = await nftBridge.wrappedAsset(CHAIN_ID_ALGORAND, algoNativeAddressB32)
  return wrappedAddr
}

export const getNFTBridgeFee = async (
  nftBridgeAddress: string,
  signer: ethers.Signer | ethers.providers.Provider,
): Promise<string> => {
  const nftBridge = NFTBridge__factory.connect(nftBridgeAddress, signer);

  const fee = await nftBridge.getFee()

  return fee.toString()
}

export const setInitArgs = async (
  signer: ethers.Signer,
  _standardId: number,
  nftBridgeAddress: string,
  selectorBytes: string,
  createData: string
): Promise<ethers.ContractReceipt> => {
  const nftBridge = NFTBridge__factory.connect(nftBridgeAddress, signer);
  const signerAddr = await signer.getAddress()

  const transaction = await nftBridge.setNFTInitArgs(_standardId, {
    selectorBytes: selectorBytes,
    data: createData,
  })
  let v = await transaction.wait()

  return v
}
