import { AptosClient } from "aptos";
import { coalesceModuleAddress, ensureHexPrefix } from "../utils";

/**
 * Determines whether or not given address is wrapped or native to Aptos.
 * @param client Client used to transfer data to/from Aptos node
 * @param tokenBridgeAddress Address of token bridge
 * @param assetFullyQualifiedType Fully qualified type of asset
 * @returns True if asset is wrapped
 */
export async function getIsWrappedAssetAptos(
  client: AptosClient,
  tokenBridgeAddress: string,
  assetFullyQualifiedType: string
): Promise<boolean> {
  assetFullyQualifiedType = ensureHexPrefix(assetFullyQualifiedType);
  try {
    // get origin info from asset address
    await client.getAccountResource(
      coalesceModuleAddress(assetFullyQualifiedType),
      `${tokenBridgeAddress}::state::OriginInfo`
    );
    return true;
  } catch {
    return false;
  }
}
