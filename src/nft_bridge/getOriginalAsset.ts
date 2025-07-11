// import { LCDClient } from "@terra-money/terra.js";
import { BigNumber, ethers } from "ethers";
import { arrayify, zeroPad } from "ethers/lib/utils";
import { canonicalAddress, WormholeWrappedInfo } from "..";
import { TokenImplementation__factory } from "../ethers-contracts";
import {
  ChainId,
  ChainName,
  CHAIN_ID_TERRA,
  coalesceChainId,
  assertChain,
  CHAIN_ID_SOLANA,
  deriveCollectionHashFromTokenId,
  hex,
  deriveTokenHashFromTokenId,
  ensureHexPrefix,
  uint8ArrayToHex,
  CHAIN_ID_APTOS,
} from "../utils";
import { getIsWrappedAssetEth } from "./getIsWrappedAsset";
import { AptosClient, TokenTypes, Types } from "aptos";
import { OriginInfo } from "../aptos/types";

// TODO: remove `as ChainId` and return number in next minor version as we can't ensure it will match our type definition
export interface WormholeWrappedNFTInfo {
  isWrapped: boolean;
  chainId: ChainId;
  assetAddress: Uint8Array;
  tokenId?: string;
}

/**
 * Returns a origin chain and asset address on {originChain} for a provided Wormhole wrapped address
 * @param tokenBridgeAddress
 * @param provider
 * @param wrappedAddress
 * @returns
 */
export async function getOriginalAssetEth(
  tokenBridgeAddress: string,
  provider: ethers.Signer | ethers.providers.Provider,
  wrappedAddress: string,
  tokenId: string,
  lookupChain: ChainId | ChainName
): Promise<WormholeWrappedNFTInfo> {
  const isWrapped = await getIsWrappedAssetEth(
    tokenBridgeAddress,
    provider,
    wrappedAddress
  );
  if (isWrapped) {
    const token = TokenImplementation__factory.connect(
      wrappedAddress,
      provider
    );
    const chainId = (await token.chainId()) as ChainId; // origin chain
    const assetAddress = await token.nativeContract(); // origin address
    return {
      isWrapped: true,
      chainId,
      assetAddress: arrayify(assetAddress),
      tokenId, // tokenIds are maintained across EVM chains
    };
  }
  return {
    isWrapped: false,
    chainId: coalesceChainId(lookupChain),
    assetAddress: zeroPad(arrayify(wrappedAddress), 32),
    tokenId,
  };
}

export async function getOriginalAssetTerra(
  client: any,
  wrappedAddress: string
): Promise<WormholeWrappedInfo> {
  try {
    const result: {
      asset_address: string;
      asset_chain: ChainId;
      bridge: string;
    } = await client.wasm.contractQuery(wrappedAddress, {
      wrapped_asset_info: {},
    });
    if (result) {
      return {
        isWrapped: true,
        chainId: result.asset_chain,
        assetAddress: new Uint8Array(
          Buffer.from(result.asset_address, "base64")
        ),
      };
    }
  } catch (e) { }
  return {
    isWrapped: false,
    chainId: CHAIN_ID_TERRA,
    assetAddress: zeroPad(canonicalAddress(wrappedAddress), 32),
  };
}

export async function getOriginalAssetAptos(
  client: AptosClient,
  nftBridgeAddress: string,
  tokenId: TokenTypes.TokenId
): Promise<WormholeWrappedNFTInfo> {
  try {
    const originInfo = (
      await client.getAccountResource(
        tokenId.token_data_id.creator,
        `${nftBridgeAddress}::state::OriginInfo`
      )
    ).data as OriginInfo;
    const chainId = Number(originInfo.token_chain.number);
    assertChain(chainId);
    return {
      isWrapped: true,
      chainId,
      assetAddress:
        chainId === CHAIN_ID_SOLANA
          ? arrayify(BigNumber.from(hex(tokenId.token_data_id.name)))
          : new Uint8Array(hex(originInfo.token_address.external_address)),
      tokenId: ensureHexPrefix(hex(tokenId.token_data_id.name).toString("hex")),
    };
  } catch (e: any) {
    if (
      !(
        (e.errorCode === "resource_not_found") &&
        e.status === 404
      )
    ) {
      throw e;
    }
  }

  return {
    isWrapped: false,
    chainId: CHAIN_ID_APTOS,
    assetAddress: await deriveCollectionHashFromTokenId(tokenId),
    tokenId: ensureHexPrefix(
      uint8ArrayToHex(await deriveTokenHashFromTokenId(tokenId))
    ),
  };
}