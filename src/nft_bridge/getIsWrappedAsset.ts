import { ethers } from "ethers";
import { Bridge__factory } from "../ethers-contracts";
import { AptosClient } from "aptos";

/**
 * Returns whether or not an asset address on Ethereum is a wormhole wrapped asset
 * @param tokenBridgeAddress
 * @param provider
 * @param assetAddress
 * @returns
 */
export async function getIsWrappedAssetEth(
  tokenBridgeAddress: string,
  provider: ethers.Signer | ethers.providers.Provider,
  assetAddress: string
) {
  if (!assetAddress) return false;
  const tokenBridge = Bridge__factory.connect(tokenBridgeAddress, provider);
  return await tokenBridge.isWrappedAsset(assetAddress);
}

export async function getIsWrappedAssetAptos(
  client: AptosClient,
  nftBridgeAddress: string,
  creatorAddress: string
) {
  try {
    await client.getAccountResource(
      creatorAddress,
      `${nftBridgeAddress}::state::OriginInfo`
    );
    return true;
  } catch (e: any) {
    if (
      (e.errorCode === "resource_not_found") &&
      e.status === 404
    ) {
      return false;
    }

    throw e;
  }
}
