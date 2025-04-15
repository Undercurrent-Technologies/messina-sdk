// import { LCDClient } from "@terra-money/terra.js";
import { Algodv2 } from "algosdk";
import { ethers } from "ethers";
import { arrayify, zeroPad } from "ethers/lib/utils";
import { decodeLocalState } from "../algorand";
import { TokenImplementation__factory } from "../ethers-contracts";
import { buildNativeId, canonicalAddress, isNativeDenom } from "../terra";
import {
  ChainId,
  ChainName,
  CHAIN_ID_ALGORAND,
  CHAIN_ID_TERRA,
  coalesceChainId,
  hexToUint8Array,
  CHAIN_ID_SOLANA,
  isValidAptosType,
  CHAIN_ID_APTOS,
  assertChain,
} from "../utils";
import { safeBigIntToNumber } from "../utils/bigint";
import {
  getIsAttestedAssetAlgorand,
  getIsAttestedAssetEth,
} from "./getIsAttestedAsset";
import {
  Commitment,
  Connection,
  PublicKey,
  PublicKeyInitData,
} from "@solana/web3.js";
import { getWrappedMeta } from "../solana/tokenBridge";
import { AptosClient } from "aptos";
import { OriginInfo } from "../aptos/types";
import { sha3_256 } from "js-sha3";
// TODO: remove `as ChainId` and return number in next minor version as we can't ensure it will match our type definition
export interface WormholeWrappedInfo {
  isWrapped: boolean;
  chainId: ChainId;
  assetAddress: Uint8Array;
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
  lookupChain: ChainId | ChainName
): Promise<WormholeWrappedInfo> {
  const isWrapped = await getIsAttestedAssetEth(
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
    };
  }
  return {
    isWrapped: false,
    chainId: coalesceChainId(lookupChain),
    assetAddress: zeroPad(arrayify(wrappedAddress), 32),
  };
}

export async function getOriginalAssetTerra(
  client: any,
  wrappedAddress: string
): Promise<WormholeWrappedInfo> {
  if (isNativeDenom(wrappedAddress)) {
    return {
      isWrapped: false,
      chainId: CHAIN_ID_TERRA,
      assetAddress: buildNativeId(wrappedAddress),
    };
  }
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
  } catch (e) {}
  return {
    isWrapped: false,
    chainId: CHAIN_ID_TERRA,
    assetAddress: zeroPad(canonicalAddress(wrappedAddress), 32),
  };
}

/**
 * Returns an origin chain and asset address on {originChain} for a provided Wormhole wrapped address
 * @param client Algodv2 client
 * @param tokenBridgeId Application ID of the token bridge
 * @param assetId Algorand asset index
 * @returns wrapped wormhole information structure
 */
export async function getOriginalAssetAlgorand(
  client: Algodv2,
  tokenBridgeId: bigint,
  assetId: bigint
): Promise<WormholeWrappedInfo> {
  let retVal: WormholeWrappedInfo = {
    isWrapped: false,
    chainId: CHAIN_ID_ALGORAND,
    assetAddress: new Uint8Array(),
  };
  retVal.isWrapped = await getIsAttestedAssetAlgorand(
    client,
    tokenBridgeId,
    assetId
  );
  if (!retVal.isWrapped) {
    retVal.assetAddress = zeroPad(hexToUint8Array(assetId.toString(16)), 32);
    return retVal;
  }
  const assetInfo = await client.getAssetByID(safeBigIntToNumber(assetId)).do();
  const lsa = assetInfo.params.creator;
  const dls = await decodeLocalState(client, tokenBridgeId, lsa);
  const dlsBuffer: Buffer = Buffer.from(dls);
  retVal.chainId = dlsBuffer.readInt16BE(92) as ChainId;
  retVal.assetAddress = new Uint8Array(dlsBuffer.slice(60, 60 + 32));
  return retVal;
}

export async function getOriginalAssetSolana(
  connection: Connection,
  tokenBridgeAddress: PublicKeyInitData,
  mintAddress: PublicKeyInitData,
  commitment?: Commitment
): Promise<WormholeWrappedInfo> {
  try {
    const mint = new PublicKey(mintAddress);

    return getWrappedMeta(
      connection,
      tokenBridgeAddress,
      mintAddress,
      commitment
    )
      .catch((_) => null)
      .then((meta) => {
        if (meta === null) {
          return {
            isWrapped: false,
            chainId: CHAIN_ID_SOLANA,
            assetAddress: mint.toBytes(),
          };
        } else {
          return {
            isWrapped: true,
            chainId: meta.chain as ChainId,
            assetAddress: Uint8Array.from(meta.tokenAddress),
          };
        }
      });
  } catch (_) {
    return {
      isWrapped: false,
      chainId: CHAIN_ID_SOLANA,
      assetAddress: new Uint8Array(32),
    };
  }
}

/**
 * Gets the origin chain ID and address of an asset on Aptos, given its fully qualified type.
 * @param client Client used to transfer data to/from Aptos node
 * @param tokenBridgePackageId Address of token bridge
 * @param fullyQualifiedType Fully qualified type of asset
 * @returns Original chain ID and address of asset
 */
export async function getOriginalAssetAptos(
  client: AptosClient,
  tokenBridgePackageId: string,
  fullyQualifiedType: string
): Promise<WormholeWrappedInfo> {
  if (!isValidAptosType(fullyQualifiedType)) {
    throw new Error("Invalid qualified type");
  }

  let originInfo: OriginInfo | undefined;
  try {
    originInfo = (
      await client.getAccountResource(
        fullyQualifiedType.split("::")[0],
        `${tokenBridgePackageId}::state::OriginInfo`
      )
    ).data as OriginInfo;
  } catch {
    return {
      isWrapped: false,
      chainId: CHAIN_ID_APTOS,
      assetAddress: hexToUint8Array(sha3_256(fullyQualifiedType)),
    };
  }

  if (!!originInfo) {
    // wrapped asset
    const chainId = parseInt(originInfo.token_chain.number);
    assertChain(chainId);
    const assetAddress = hexToUint8Array(
      originInfo.token_address.external_address.substring(2)
    );
    return {
      isWrapped: true,
      chainId,
      assetAddress,
    };
  } else {
    // native asset
    return {
      isWrapped: false,
      chainId: CHAIN_ID_APTOS,
      assetAddress: hexToUint8Array(sha3_256(fullyQualifiedType)),
    };
  }
}
