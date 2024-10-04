import { importCoreWasm } from "@certusone/wormhole-sdk-wasm";
import { Algodv2, bigIntToBytes } from "algosdk";
import {
  BITS_PER_KEY,
  calcLogicSigAccount,
  MAX_BITS,
  _parseVAAAlgorand,
} from "../algorand";
import { safeBigIntToNumber } from "../utils/bigint";
import { ethers } from "ethers";
import { uint8ArrayToHex } from "../utils";
import { Bridge__factory } from "../ethers-contracts";
import { Commitment, Connection, PublicKeyInitData } from "@solana/web3.js";
import { getClaim } from "../solana/wormhole";
import { parseVaa, SignedVaa } from "../vaa/wormhole";

export async function getIsTransferCompletedEth(
  tokenBridgeAddress: string,
  provider: ethers.Signer | ethers.providers.Provider,
  signedVAA: Uint8Array
): Promise<boolean> {
  const tokenBridge = Bridge__factory.connect(tokenBridgeAddress, provider);
  const signedVAAHash = await getSignedVAAHash(signedVAA);
  return await tokenBridge.isTransferCompleted(signedVAAHash);
}

export async function getSignedVAAHash(signedVAA: Uint8Array) {
  const { parse_vaa } = await importCoreWasm();
  const parsedVAA = parse_vaa(signedVAA);
  const body = [
    ethers.utils.defaultAbiCoder.encode(["uint32"], [parsedVAA.timestamp]).substring(2 + (64 - 8)),
    ethers.utils.defaultAbiCoder.encode(["uint32"], [parsedVAA.nonce]).substring(2 + (64 - 8)),
    ethers.utils.defaultAbiCoder.encode(["uint16"], [parsedVAA.emitter_chain]).substring(2 + (64 - 4)),
    ethers.utils.defaultAbiCoder.encode(["bytes32"], [parsedVAA.emitter_address]).substring(2),
    ethers.utils.defaultAbiCoder.encode(["uint64"], [parsedVAA.sequence]).substring(2 + (64 - 16)),
    ethers.utils.defaultAbiCoder.encode(["uint8"], [parsedVAA.consistency_level]).substring(2 + (64 - 2)),
    uint8ArrayToHex(parsedVAA.payload),
  ];
  return ethers.utils.solidityKeccak256(["bytes"], [ethers.utils.solidityKeccak256(["bytes"], ["0x" + body.join("")])]);
}


/**
 * This function is used to check if a VAA has been redeemed by looking at a specific bit.
 * @param client AlgodV2 client
 * @param appId Application Id
 * @param addr Wallet address. Someone has to pay for this.
 * @param seq The sequence number of the redemption
 * @returns true, if the bit was set and VAA was redeemed, false otherwise.
 */
async function checkBitsSet(
  client: Algodv2,
  appId: bigint,
  addr: string,
  seq: bigint
): Promise<boolean> {
  let retval: boolean = false;
  let appState: any[] = [];
  const acctInfo = await client.accountInformation(addr).do();
  const als = acctInfo["apps-local-state"];
  als.forEach((app: any) => {
    if (BigInt(app["id"]) === appId) {
      appState = app["key-value"];
    }
  });
  if (appState.length === 0) {
    return retval;
  }

  const BIG_MAX_BITS: bigint = BigInt(MAX_BITS);
  const BIG_EIGHT: bigint = BigInt(8);
  // Start on a MAX_BITS boundary
  const start: bigint = (seq / BIG_MAX_BITS) * BIG_MAX_BITS;
  // beg should be in the range [0..MAX_BITS]
  const beg: number = safeBigIntToNumber(seq - start);
  // s should be in the range [0..15]
  const s: number = Math.floor(beg / BITS_PER_KEY);
  const b: number = Math.floor((beg - s * BITS_PER_KEY) / 8);

  const key = Buffer.from(bigIntToBytes(s, 1)).toString("base64");
  appState.forEach((kv) => {
    if (kv["key"] === key) {
      const v = Buffer.from(kv["value"]["bytes"], "base64");
      const bt = 1 << safeBigIntToNumber(seq % BIG_EIGHT);
      retval = (v[b] & bt) != 0;
      return;
    }
  });
  return retval;
}

/**
 * <p>Returns true if this transfer was completed on Algorand</p>
 * @param client AlgodV2 client
 * @param appId Most likely the Token bridge ID
 * @param signedVAA VAA to check
 * @param wallet The account paying the bill for this (it isn't free)
 * @returns true if VAA has been redeemed, false otherwise
 */
export async function getIsTransferCompletedAlgorand(
  client: Algodv2,
  appId: bigint,
  signedVAA: Uint8Array
): Promise<boolean> {
  const parsedVAA: Map<string, any> = _parseVAAAlgorand(signedVAA);
  const seq: bigint = parsedVAA.get("sequence");
  const chainRaw: string = parsedVAA.get("chainRaw"); // this needs to be a hex string
  const em: string = parsedVAA.get("emitter"); // this needs to be a hex string
  const { doesExist, lsa } = await calcLogicSigAccount(
    client,
    appId,
    seq / BigInt(MAX_BITS),
    chainRaw + em
  );
  if (!doesExist) {
    return false;
  }
  const seqAddr = lsa.address();
  const retVal: boolean = await checkBitsSet(client, appId, seqAddr, seq);
  return retVal;
}

export async function getIsTransferCompletedSolana(
  tokenBridgeAddress: PublicKeyInitData,
  signedVAA: SignedVaa,
  connection: Connection,
  commitment?: Commitment
): Promise<boolean> {
  const parsed = parseVaa(signedVAA);
  return getClaim(
    connection,
    tokenBridgeAddress,
    parsed.emitterAddress,
    parsed.emitterChain,
    parsed.sequence,
    commitment
  ).catch((e) => false);
}