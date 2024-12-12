import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import {
  PublicKey,
  PublicKeyInitData,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  TransactionInstruction,
} from "@solana/web3.js";
import {
  isBytes,
  parseAttestMetaVaa,
  ParsedAttestMetaVaa,
  SignedVaa,
} from "../../../vaa";
import { TOKEN_METADATA_PROGRAM_ID } from "../../utils";
import { deriveClaimKey, derivePostedVaaKey } from "../../wormhole";
import {
  deriveEndpointKey,
  deriveMintAuthorityKey,
  deriveTokenBridgeConfigKey,
  deriveTokenConfigKey,
  deriveTokenMetadataKey,
  deriveWrappedMetaKey,
  deriveWrappedMintKey,
} from "../accounts";
import { createReadOnlyTokenBridgeProgramInterface } from "../program";

export function createCreateWrappedInstruction(
  tokenBridgeProgramId: PublicKeyInitData,
  wormholeProgramId: PublicKeyInitData,
  payer: PublicKeyInitData,
  mintPubkey: PublicKeyInitData,
  vaa: SignedVaa | ParsedAttestMetaVaa,
  tokenConfigData: WrappedTokenConfigData
): TransactionInstruction {
  const methods =
    createReadOnlyTokenBridgeProgramInterface(
      tokenBridgeProgramId
    ).methods.createWrapped(
      tokenConfigData.escrowAddress,
      tokenConfigData.transferFee,
      tokenConfigData.redeemFee,
      tokenConfigData.min,
      tokenConfigData.max,
      tokenConfigData.src,
      tokenConfigData.dst,
      tokenConfigData.w1,
      tokenConfigData.w2,
    );

  // @ts-ignore
  return methods._ixFn(...methods._args, {
    accounts: getCreateWrappedAccounts(
      tokenBridgeProgramId,
      wormholeProgramId,
      payer,
      mintPubkey,
      vaa
    ) as any,
    signers: undefined,
    remainingAccounts: undefined,
    preInstructions: undefined,
    postInstructions: undefined,
  });
}

export interface WrappedTokenConfigData {
  escrowAddress: PublicKey;
  transferFee: bigint;
  redeemFee: bigint;
  min: bigint;
  max: bigint;
  src: boolean;
  dst: boolean;
  w1: PublicKey;
  w2: PublicKey;
}

export interface CreateWrappedAccounts {
  payer: PublicKey;
  config: PublicKey;
  tokenConfig: PublicKey;
  endpoint: PublicKey;
  vaa: PublicKey;
  claim: PublicKey;
  mint: PublicKey;
  wrappedMeta: PublicKey;
  splMetadata: PublicKey;
  mintAuthority: PublicKey;
  rent: PublicKey;
  systemProgram: PublicKey;
  tokenProgram: PublicKey;
  splMetadataProgram: PublicKey;
  wormholeProgram: PublicKey;
}

export function getCreateWrappedAccounts(
  tokenBridgeProgramId: PublicKeyInitData,
  wormholeProgramId: PublicKeyInitData,
  payer: PublicKeyInitData,
  mintPubkey: PublicKeyInitData,
  vaa: SignedVaa | ParsedAttestMetaVaa
): CreateWrappedAccounts {
  const parsed = isBytes(vaa) ? parseAttestMetaVaa(vaa) : vaa;
  const mint = new PublicKey(mintPubkey);

  return {
    payer: new PublicKey(payer),
    config: deriveTokenBridgeConfigKey(tokenBridgeProgramId),
    tokenConfig: deriveTokenConfigKey(tokenBridgeProgramId, mint),
    endpoint: deriveEndpointKey(
      tokenBridgeProgramId,
      parsed.emitterChain,
      parsed.emitterAddress
    ),
    vaa: derivePostedVaaKey(wormholeProgramId, parsed.hash),
    claim: deriveClaimKey(
      tokenBridgeProgramId,
      parsed.emitterAddress,
      parsed.emitterChain,
      parsed.sequence
    ),
    mint,
    wrappedMeta: deriveWrappedMetaKey(tokenBridgeProgramId, mint),
    splMetadata: deriveTokenMetadataKey(mint),

    mintAuthority: deriveMintAuthorityKey(tokenBridgeProgramId),
    rent: SYSVAR_RENT_PUBKEY,
    systemProgram: SystemProgram.programId,
    wormholeProgram: new PublicKey(wormholeProgramId),
    splMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
    tokenProgram: TOKEN_PROGRAM_ID,
  }
}
