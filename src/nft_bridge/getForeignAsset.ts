// import { LCDClient } from "@terra-money/terra.js";
import { ethers } from "ethers";
import { fromUint8Array } from "js-base64";
import { NFTBridge__factory } from "../ethers-contracts";
import { 
  CHAIN_ID_APTOS, 
  ChainId, 
  ChainName, 
  coalesceChainId, 
  getTokenIdFromTokenHash,
  deriveResourceAccountAddress,
  hexToUint8Array,
  ensureHexPrefix,
} from "../utils";
import {
  ApiError,
  AptosClient,
  HexString,
  TokenClient,
  TokenTypes,
} from "aptos";
import { CreateTokenDataEvent } from "../aptos/types";

/**
 * Returns a foreign asset address on Ethereum for a provided native chain and asset address, AddressZero if it does not exist
 * @param tokenBridgeAddress
 * @param provider
 * @param originChain
 * @param originAsset zero pad to 32 bytes
 * @returns
 */
export async function getForeignAssetEth(
  tokenBridgeAddress: string,
  provider: ethers.Signer | ethers.providers.Provider,
  originChain: ChainId | ChainName,
  originAsset: Uint8Array
): Promise<string | null> {
  const originChainId = coalesceChainId(originChain);
  const tokenBridge = NFTBridge__factory.connect(tokenBridgeAddress, provider);
  try {
    return await tokenBridge.wrappedAsset(originChainId, originAsset);
  } catch (e) {
    return null;
  }
}

/**
 * Returns a foreign asset address on Terra for a provided native chain and asset address
 * @param tokenBridgeAddress
 * @param client
 * @param originChain
 * @param originAsset
 * @returns
 */
export async function getForeignAssetTerra(
  tokenBridgeAddress: string,
  client: any,
  originChain: ChainId,
  originAsset: Uint8Array
): Promise<string | null> {
  const originChainId = coalesceChainId(originChain);
  try {
    const address = fromUint8Array(originAsset);
    const result: { address: string } = await client.wasm.contractQuery(
      tokenBridgeAddress,
      {
        wrapped_registry: {
          chain: originChainId,
          address,
        },
      }
    );
    return result.address;
  } catch (e) {
    return null;
  }
}

export async function getForeignAssetAptos(
  client: AptosClient,
  nftBridgeAddress: string,
  originChain: ChainId | ChainName,
  originAddress: Uint8Array,
  tokenId?: Uint8Array | Buffer | bigint
): Promise<TokenTypes.TokenId | null> {
  const originChainId = coalesceChainId(originChain);
  if (originChainId === CHAIN_ID_APTOS) {
    return getTokenIdFromTokenHash(client, nftBridgeAddress, originAddress);
  }

  const creatorAddress = await deriveResourceAccountAddress(
    nftBridgeAddress,
    originChainId,
    originAddress
  );
  if (!creatorAddress) {
    throw new Error("Could not derive creator account address");
  }

  if (typeof tokenId === "bigint") {
    tokenId = hexToUint8Array(BigInt(tokenId).toString(16).padStart(64, "0"));
  }

  if (!tokenId) {
    throw new Error("Invalid token ID");
  }

  const tokenIdAsUint8Array = new Uint8Array(tokenId);

  // Each creator account should contain a single collection that contains the
  // corresponding token creation events. Return if we find it in the first
  // page, otherwise reconstruct the token id from the first event.
  const PAGE_SIZE = 25;
  const events = (await client.getEventsByEventHandle(
    creatorAddress,
    "0x3::token::Collections",
    "create_token_data_events",
    { limit: PAGE_SIZE }
  )) as CreateTokenDataEvent[];
  const event = events.find(
    (e) =>
      ensureHexPrefix((e as CreateTokenDataEvent).data.id.name) ===
      HexString.fromUint8Array(tokenIdAsUint8Array).hex()
  );
  if (event) {
    return {
      token_data_id: event.data.id,
      property_version: "0", // property version always "0" for wrapped tokens
    };
  }

  // Skip pagination, reconstruct token id, and check to see if it exists
  try {
    const tokenIdObj = {
      token_data_id: {
        ...events[0].data.id,
        name: HexString.fromUint8Array(tokenIdAsUint8Array).noPrefix(),
      },
      property_version: "0",
    };
    await new TokenClient(client).getTokenData(
      tokenIdObj.token_data_id.creator,
      tokenIdObj.token_data_id.collection,
      tokenIdObj.token_data_id.name
    );
    return tokenIdObj;
  } catch (e) {
    if (
      e instanceof ApiError &&
      e.status === 404 &&
      e.errorCode === "table_item_not_found"
    ) {
      return null;
    }

    throw e;
  }
}