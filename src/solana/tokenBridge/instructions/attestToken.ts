import {
  PublicKey,
  PublicKeyInitData,
  TransactionInstruction,
} from "@solana/web3.js";
import { createReadOnlyTokenBridgeProgramInterface } from "../program";
import { getPostMessageAccounts } from "../../wormhole";
import {
  deriveTokenMetadataKey,
  deriveTokenBridgeConfigKey,
  deriveWrappedMetaKey,
  deriveTokenConfigKey,
} from "../accounts";

export function createAttestTokenInstruction(
  tokenBridgeProgramId: PublicKeyInitData,
  wormholeProgramId: PublicKeyInitData,
  payer: PublicKeyInitData,
  mint: PublicKeyInitData,
  message: PublicKeyInitData,
  nonce: number,
  tokenConfigData: TokenConfigData
): TransactionInstruction {
  const methods =
    createReadOnlyTokenBridgeProgramInterface(
      tokenBridgeProgramId
    ).methods.attestToken(
      nonce,
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
    accounts: getAttestTokenAccounts(
      tokenBridgeProgramId,
      wormholeProgramId,
      payer,
      mint,
      message
    ) as any,
    signers: undefined,
    remainingAccounts: undefined,
    preInstructions: undefined,
    postInstructions: undefined,
  });
}

export interface TokenConfigData {
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

export interface AttestTokenAccounts {
  payer: PublicKey;
  config: PublicKey;
  tokenConfig: PublicKey;
  mint: PublicKey;
  wrappedMeta: PublicKey;
  splMetadata: PublicKey;
  wormholeBridge: PublicKey;
  wormholeMessage: PublicKey;
  wormholeEmitter: PublicKey;
  wormholeSequence: PublicKey;
  wormholeFeeCollector: PublicKey;
  clock: PublicKey;
  rent: PublicKey;
  systemProgram: PublicKey;
  wormholeProgram: PublicKey;
}

export function getAttestTokenAccounts(
  tokenBridgeProgramId: PublicKeyInitData,
  wormholeProgramId: PublicKeyInitData,
  payer: PublicKeyInitData,
  mint: PublicKeyInitData,
  message: PublicKeyInitData
): AttestTokenAccounts {
  const {
    bridge: wormholeBridge,
    emitter: wormholeEmitter,
    sequence: wormholeSequence,
    feeCollector: wormholeFeeCollector,
    clock,
    rent,
    systemProgram,
  } = getPostMessageAccounts(
    wormholeProgramId,
    payer,
    tokenBridgeProgramId,
    message
  );

  return {
    payer: new PublicKey(payer),
    config: deriveTokenBridgeConfigKey(tokenBridgeProgramId),
    tokenConfig: deriveTokenConfigKey(tokenBridgeProgramId, mint),
    mint: new PublicKey(mint),
    wrappedMeta: deriveWrappedMetaKey(tokenBridgeProgramId, mint),
    splMetadata: deriveTokenMetadataKey(mint),
    wormholeBridge,
    wormholeMessage: new PublicKey(message),
    wormholeEmitter,
    wormholeSequence,
    wormholeFeeCollector,
    clock,
    rent,
    systemProgram,
    wormholeProgram: new PublicKey(wormholeProgramId),
  };
}
