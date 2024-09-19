import { Connection, PublicKey, PublicKeyInitData } from "@solana/web3.js";
import { Program, Provider } from "@project-serum/anchor";
import { createReadOnlyProvider } from "../utils";
import { TokenBridgeCoder } from "./coder";
import { TokenBridge } from "../types/tokenBridge";

import IDL from "../../anchor-idl/token_bridge.json";

export function createTokenBridgeProgramInterface(
  programId: PublicKeyInitData,
  provider?: Provider
): Program<any> {
  return new Program<any>(
    IDL as TokenBridge,
    new PublicKey(programId),
    provider === undefined ? ({ connection: null } as any) : provider,
    coder()
  );
}

export function createReadOnlyTokenBridgeProgramInterface(
  programId: PublicKeyInitData,
  connection?: Connection
): Program<any> {
  return createTokenBridgeProgramInterface(
    programId,
    createReadOnlyProvider(connection)
  );
}

export function coder(): TokenBridgeCoder {
  return new TokenBridgeCoder(IDL as any);
}
