import {
  PublicKey,
  PublicKeyInitData,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  TransactionInstruction,
} from "@solana/web3.js";
import { createReadOnlyTokenBridgeProgramInterface } from "../program";
import { deriveTokenBridgeConfigKey, deriveTokenConfigKey } from "../accounts";
import { WrappedTokenConfigData } from "./createWrapped";

export function createUpdateTreasuryAddressInstruction(
  tokenBridgeProgramId: PublicKeyInitData,
  payer: PublicKeyInitData,
  treasury: PublicKeyInitData
): TransactionInstruction {
  const methods = createReadOnlyTokenBridgeProgramInterface(tokenBridgeProgramId).methods.updateTreasuryAddress(
    treasury as any
  );

  // @ts-ignore
  return methods._ixFn(...methods._args, {
    accounts: getUpdateTreasuryAddressAccounts(tokenBridgeProgramId, payer) as any,
    signers: undefined,
    remainingAccounts: undefined,
    preInstructions: undefined,
    postInstructions: undefined,
  });
}

export interface UpdateTreasuryAddressAccounts {
  payer: PublicKey;
  config: PublicKey;
  rent: PublicKey;
  systemProgram: PublicKey;
}

export function getUpdateTreasuryAddressAccounts(
  tokenBridgeProgramId: PublicKeyInitData,
  payer: PublicKeyInitData
): UpdateTreasuryAddressAccounts {
  return {
    payer: new PublicKey(payer),
    config: deriveTokenBridgeConfigKey(tokenBridgeProgramId),
    rent: SYSVAR_RENT_PUBKEY,
    systemProgram: SystemProgram.programId,
  };
}

export function createUpdateWhitelistedAddressesInstruction(
  tokenBridgeProgramId: PublicKeyInitData,
  payer: PublicKeyInitData,
  mint: PublicKeyInitData,
  whitelistAddress1: PublicKeyInitData,
  whitelistAddress2: PublicKeyInitData
): TransactionInstruction {
  const methods = createReadOnlyTokenBridgeProgramInterface(tokenBridgeProgramId).methods.updateWhitelistedAddresses(
    whitelistAddress1 as any,
    whitelistAddress2 as any
  );

  // @ts-ignore
  return methods._ixFn(...methods._args, {
    accounts: getUpdateWhitelistedAddressesAccounts(tokenBridgeProgramId, mint, payer) as any,
    signers: undefined,
    remainingAccounts: undefined,
    preInstructions: undefined,
    postInstructions: undefined,
  });
}

export interface UpdateWhitelistedAddressesAccounts {
  payer: PublicKey;
  config: PublicKey;
  tokenConfig: PublicKey;
  rent: PublicKey;
  systemProgram: PublicKey;
}

export function getUpdateWhitelistedAddressesAccounts(
  tokenBridgeProgramId: PublicKeyInitData,
  mint: PublicKeyInitData,
  payer: PublicKeyInitData
): UpdateWhitelistedAddressesAccounts {
  return {
    payer: new PublicKey(payer),
    config: deriveTokenBridgeConfigKey(tokenBridgeProgramId),
    tokenConfig: deriveTokenConfigKey(tokenBridgeProgramId, mint),
    rent: SYSVAR_RENT_PUBKEY,
    systemProgram: SystemProgram.programId,
  };
}

export function createUpdateAdminAddressInstruction(
  tokenBridgeProgramId: PublicKeyInitData,
  payer: PublicKeyInitData,
  adminAddress: PublicKeyInitData
): TransactionInstruction {
  const methods = createReadOnlyTokenBridgeProgramInterface(tokenBridgeProgramId).methods.updateAdminAddress(
    adminAddress as any
  );

  // @ts-ignore
  return methods._ixFn(...methods._args, {
    accounts: getUpdateAdminAddressAccounts(tokenBridgeProgramId, payer) as any,
    signers: undefined,
    remainingAccounts: undefined,
    preInstructions: undefined,
    postInstructions: undefined,
  });
}

export interface UpdateAdminAddressAccounts {
  payer: PublicKey;
  config: PublicKey;
  rent: PublicKey;
  systemProgram: PublicKey;
}

export function getUpdateAdminAddressAccounts(
  tokenBridgeProgramId: PublicKeyInitData,
  payer: PublicKeyInitData
): UpdateAdminAddressAccounts {
  return {
    payer: new PublicKey(payer),
    config: deriveTokenBridgeConfigKey(tokenBridgeProgramId),
    rent: SYSVAR_RENT_PUBKEY,
    systemProgram: SystemProgram.programId,
  };
}

export function createSetPauseStatusInstruction(
  tokenBridgeProgramId: PublicKeyInitData,
  payer: PublicKeyInitData,
  isPaused: boolean
): TransactionInstruction {
  const methods = createReadOnlyTokenBridgeProgramInterface(tokenBridgeProgramId).methods.setPauseStatus(isPaused);

  // @ts-ignore
  return methods._ixFn(...methods._args, {
    accounts: getSetPauseStatusAccounts(tokenBridgeProgramId, payer) as any,
    signers: undefined,
    remainingAccounts: undefined,
    preInstructions: undefined,
    postInstructions: undefined,
  });
}

export interface SetPauseStatusAccounts {
  payer: PublicKey;
  config: PublicKey;
  rent: PublicKey;
  systemProgram: PublicKey;
}

export function getSetPauseStatusAccounts(
  tokenBridgeProgramId: PublicKeyInitData,
  payer: PublicKeyInitData
): SetPauseStatusAccounts {
  return {
    payer: new PublicKey(payer),
    config: deriveTokenBridgeConfigKey(tokenBridgeProgramId),
    rent: SYSVAR_RENT_PUBKEY,
    systemProgram: SystemProgram.programId,
  };
}


export function createUpdateTokenConfigInstruction(
  tokenBridgeProgramId: PublicKeyInitData,
  payer: PublicKeyInitData,
  mint: PublicKeyInitData,
  tokenConfigData: WrappedTokenConfigData
): TransactionInstruction {
  const methods = createReadOnlyTokenBridgeProgramInterface(tokenBridgeProgramId).methods.updateTokenConfig(
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
    accounts: getUpdateTokenConfigAccounts(tokenBridgeProgramId, mint, payer) as any,
    signers: undefined,
    remainingAccounts: undefined,
    preInstructions: undefined,
    postInstructions: undefined,
  });
}
export interface UpdateTokenConfigAccounts {
  payer: PublicKey;
  mint: PublicKey;
  config: PublicKey;
  tokenConfig: PublicKey;
  rent: PublicKey;
  systemProgram: PublicKey;
}

export function getUpdateTokenConfigAccounts(
  tokenBridgeProgramId: PublicKeyInitData,
  mint: PublicKeyInitData,
  payer: PublicKeyInitData
): UpdateTokenConfigAccounts {
  return {
    payer: new PublicKey(payer),
    mint: new PublicKey(mint),
    config: deriveTokenBridgeConfigKey(tokenBridgeProgramId),
    tokenConfig: deriveTokenConfigKey(tokenBridgeProgramId, mint),
    rent: SYSVAR_RENT_PUBKEY,
    systemProgram: SystemProgram.programId,
  };
}
