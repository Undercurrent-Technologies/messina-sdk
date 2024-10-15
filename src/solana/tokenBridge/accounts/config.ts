import { Connection, PublicKey, Commitment, PublicKeyInitData } from "@solana/web3.js";
import { deriveAddress, getAccountData } from "../../utils";

export function deriveTokenBridgeConfigKey(tokenBridgeProgramId: PublicKeyInitData): PublicKey {
  return deriveAddress([Buffer.from("config")], tokenBridgeProgramId);
}

export async function getTokenBridgeConfig(
  connection: Connection,
  tokenBridgeProgramId: PublicKeyInitData,
  commitment?: Commitment
): Promise<TokenBridgeConfig> {
  return connection
    .getAccountInfo(deriveTokenBridgeConfigKey(tokenBridgeProgramId), commitment)
    .then((info) => TokenBridgeConfig.deserialize(getAccountData(info)));
}

export class TokenBridgeConfig {
  isPaused: boolean;
  wormhole: PublicKey;
  owner: PublicKey;
  treasury: PublicKey;
  admin: PublicKey;

  constructor(
    isPaused: boolean,
    wormholeProgramId: Buffer,
    owner: Buffer,
    treasury: Buffer,
    admin: Buffer
  ) {
    this.isPaused = isPaused;
    this.wormhole = new PublicKey(wormholeProgramId);
    this.owner = new PublicKey(owner);
    this.treasury = new PublicKey(treasury);
    this.admin = new PublicKey(admin);
  }

  static deserialize(data: Buffer): TokenBridgeConfig {
    const isPaused = data.readUInt8(0) == 1;
    const wormholeProgramId = data.subarray(1, 33);
    const owner = data.subarray(33, 65);
    const treasury = data.subarray(65, 97);
    const admin = data.subarray(97, 129);
    return new TokenBridgeConfig(
      isPaused,
      wormholeProgramId,
      owner,
      treasury,
      admin
    );
  }
}
