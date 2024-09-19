import {
  PublicKey,
  PublicKeyInitData,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  TransactionInstruction,
} from "@solana/web3.js";
import { createReadOnlyTokenBridgeProgramInterface } from "../program";
import { deriveCustodyKey, deriveCustodySignerKey, deriveTokenBridgeConfigKey, deriveTokenConfigKey } from "../accounts";
import { BN } from "@project-serum/anchor";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

export function createDepositInstruction(
  tokenBridgeProgramId: PublicKeyInitData,
  payer: PublicKeyInitData,
  mint: PublicKeyInitData,
  from: PublicKeyInitData,
  amount: bigint
): TransactionInstruction {
  const methods = createReadOnlyTokenBridgeProgramInterface(tokenBridgeProgramId).methods.deposit(
    amount as any
  );

  // @ts-ignore
  return methods._ixFn(...methods._args, {
    accounts: getDepositAccounts(tokenBridgeProgramId, payer, mint, from) as any,
    signers: undefined,
    remainingAccounts: undefined,
    preInstructions: undefined,
    postInstructions: undefined,
  });
}

export interface DepositAccounts {
  payer: PublicKey;
  config: PublicKey;
  tokenConfig: PublicKey;
  mint: PublicKey;
  from: PublicKey;
  custodyKey: PublicKey;
  custodySigner: PublicKey;
  rent: PublicKey;
  systemProgram: PublicKey;
  splTokenProgram: PublicKey;
}

export function getDepositAccounts(
  tokenBridgeProgramId: PublicKeyInitData,
  payer: PublicKeyInitData,
  mint: PublicKeyInitData,
  from: PublicKeyInitData,
): DepositAccounts {
  return {
    payer: new PublicKey(payer),
    config: deriveTokenBridgeConfigKey(tokenBridgeProgramId),
    tokenConfig: deriveTokenConfigKey(tokenBridgeProgramId, mint),
    mint: new PublicKey(mint),
    from: new PublicKey(from),
    custodyKey: deriveCustodyKey(tokenBridgeProgramId, mint),
    custodySigner: deriveCustodySignerKey(tokenBridgeProgramId),
    rent: SYSVAR_RENT_PUBKEY,
    systemProgram: SystemProgram.programId,
    splTokenProgram: TOKEN_PROGRAM_ID,
  };
}

export function createWithdrawInstruction(
  tokenBridgeProgramId: PublicKeyInitData,
  payer: PublicKeyInitData,
  mint: PublicKeyInitData,
  to: PublicKeyInitData,
  amount: bigint
): TransactionInstruction {
  const methods = createReadOnlyTokenBridgeProgramInterface(tokenBridgeProgramId).methods.withdraw(
    amount as any
  );

  // @ts-ignore
  return methods._ixFn(...methods._args, {
    accounts: getWithdrawAccounts(tokenBridgeProgramId, payer, mint, to) as any,
    signers: undefined,
    remainingAccounts: undefined,
    preInstructions: undefined,
    postInstructions: undefined,
  });
}

export interface WithdrawAccounts {
  payer: PublicKey;
  config: PublicKey;
  tokenConfig: PublicKey;
  mint: PublicKey;
  to: PublicKey;
  custodyKey: PublicKey;
  custodySigner: PublicKey;
  rent: PublicKey;
  systemProgram: PublicKey;
  splTokenProgram: PublicKey;
}

export function getWithdrawAccounts(
  tokenBridgeProgramId: PublicKeyInitData,
  payer: PublicKeyInitData,
  mint: PublicKeyInitData,
  to: PublicKeyInitData,
): WithdrawAccounts {
  return {
    payer: new PublicKey(payer),
    config: deriveTokenBridgeConfigKey(tokenBridgeProgramId),
    tokenConfig: deriveTokenConfigKey(tokenBridgeProgramId, mint),
    mint: new PublicKey(mint),
    to: new PublicKey(to),
    custodyKey: deriveCustodyKey(tokenBridgeProgramId, mint),
    custodySigner: deriveCustodySignerKey(tokenBridgeProgramId),
    rent: SYSVAR_RENT_PUBKEY,
    systemProgram: SystemProgram.programId,
    splTokenProgram: TOKEN_PROGRAM_ID,
  };
}