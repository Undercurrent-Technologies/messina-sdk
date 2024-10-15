import { Connection, PublicKey, Commitment, PublicKeyInitData } from "@solana/web3.js";
import { deriveAddress, getAccountData } from "../../utils";


export function deriveTokenConfigKey(tokenBridgeProgramId: PublicKeyInitData, mint: PublicKeyInitData): PublicKey {
  return deriveAddress([Buffer.from("token_config"), new PublicKey(mint).toBuffer()], tokenBridgeProgramId);
}

export async function getTokenConfig(
  connection: Connection,
  tokenBridgeProgramId: PublicKeyInitData,
  mint: PublicKeyInitData,
  commitment?: Commitment
): Promise<TokenConfig> {
  return connection
    .getAccountInfo(deriveTokenConfigKey(tokenBridgeProgramId, mint), commitment)
    .then((info) => TokenConfig.deserialize(getAccountData(info)));
}

export class TokenConfig {
  escrow: PublicKey;
  transferFee: bigint;
  redeemFee: bigint;
  min: bigint;
  max: bigint;
  src: boolean;
  dst: boolean;
  w1: PublicKey;
  w2: PublicKey;

  constructor(
    escrowAddress: Buffer,
    transferFee: bigint,
    redeemFee: bigint,
    min: bigint,
    max: bigint,
    src: boolean,
    dst: boolean,
    w1: Buffer,
    w2: Buffer,
  ) {
    this.escrow = new PublicKey(escrowAddress);
    this.transferFee = transferFee;
    this.redeemFee = redeemFee;
    this.min = min;
    this.max = max;
    this.src = src;
    this.dst = dst;
    this.w1 = new PublicKey(w1);
    this.w2 = new PublicKey(w2);
  }

  static deserialize(data: Buffer): TokenConfig {
    const escrowAddress = data.subarray(0, 32);
    const transferFee = data.readBigUInt64LE(32);
    const redeemFee = data.readBigUInt64LE(40);
    const min = data.readBigUInt64LE(48);
    const max = data.readBigUInt64LE(56);
    const src = data.readUInt8(64) == 1;
    const dst = data.readUInt8(65) == 1;
    const w1 = data.subarray(66, 98);
    const w2 = data.subarray(98, 130);
    return new TokenConfig(
      escrowAddress,
      transferFee,
      redeemFee,
      min,
      max,
      src,
      dst,
      w1,
      w2,
    );
  }
}
