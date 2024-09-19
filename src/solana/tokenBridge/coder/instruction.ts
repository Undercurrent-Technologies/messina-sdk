import { Idl, InstructionCoder } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";

export class TokenBridgeInstructionCoder implements InstructionCoder {
  constructor(_: Idl) {}

  encode(ixName: string, ix: any): Buffer {
    switch (ixName) {
      case "initialize": {
        return encodeInitialize(ix);
      }
      case "attestToken": {
        return encodeAttestToken(ix);
      }
      case "completeNative": {
        return encodeCompleteNative(ix);
      }
      case "completeWrapped": {
        return encodeCompleteWrapped(ix);
      }
      case "transferWrapped": {
        return encodeTransferWrapped(ix);
      }
      case "transferNative": {
        return encodeTransferNative(ix);
      }
      case "registerChain": {
        return encodeRegisterChain(ix);
      }
      case "createWrapped": {
        return encodeCreateWrapped(ix);
      }
      case "upgradeContract": {
        return encodeUpgradeContract(ix);
      }
      case "transferWrappedWithPayload": {
        return encodeTransferWrappedWithPayload(ix);
      }
      case "transferNativeWithPayload": {
        return encodeTransferNativeWithPayload(ix);
      }
      case "updateTreasuryAddress": {
        return encodeUpdateTreasuryAddress(ix);
      }
      case "updateWhitelistedAddresses": {
        return encodeUpdateWhitelistedAddresses(ix);
      }
      case "updateAdminAddress": {
        return encodeUpdateAdminAddress(ix);
      }
      case "setPauseStatus": {
        return encodeSetPauseStatus(ix);
      }
      case "deposit": {
        return encodeDeposit(ix);
      }
      case "withdraw": {
        return encodeWithdraw(ix);
      }
      default: {
        throw new Error(`Invalid instruction: ${ixName}`);
      }
    }
  }

  encodeState(_ixName: string, _ix: any): Buffer {
    throw new Error("Token Bridge program does not have state");
  }
}

/** Solitaire enum of existing the Token Bridge's instructions.
 *
 * https://github.com/certusone/wormhole/blob/main/solana/modules/token_bridge/program/src/lib.rs#L100
 */
export enum TokenBridgeInstruction {
  Initialize,
  AttestToken,
  CompleteNative,
  CompleteWrapped,
  TransferWrapped,
  TransferNative,
  RegisterChain,
  CreateWrapped,
  UpgradeContract,
  CompleteNativeWithPayload,
  CompleteWrappedWithPayload,
  TransferWrappedWithPayload,
  TransferNativeWithPayload,
  UpdateTreasuryAddress,
  UpdateAdminAddress,
  SetPauseStatus,
  UpdateWhitelistedAddresses,
  Withdraw,
  Deposit,
}

function encodeTokenBridgeInstructionData(
  instructionType: TokenBridgeInstruction,
  data?: Buffer
): Buffer {
  const dataLen = data === undefined ? 0 : data.length;
  const instructionData = Buffer.alloc(1 + dataLen);
  instructionData.writeUInt8(instructionType, 0);
  if (dataLen > 0) {
    instructionData.write(data!.toString("hex"), 1, "hex");
  }
  return instructionData;
}

function encodeDeposit({amount}: any): Buffer {
  if (typeof amount != "bigint") {
    amount = BigInt(amount);
  }
  const serialized = Buffer.alloc(8);
  serialized.writeBigUInt64LE(BigInt(amount), 0);
  return encodeTokenBridgeInstructionData(
    TokenBridgeInstruction.Deposit,
    serialized
  );
}

function encodeWithdraw({amount}: any): Buffer {
  if (typeof amount != "bigint") {
    amount = BigInt(amount);
  }
  const serialized = Buffer.alloc(8);
  serialized.writeBigUInt64LE(BigInt(amount), 0);
  return encodeTokenBridgeInstructionData(
    TokenBridgeInstruction.Withdraw,
    serialized
  );
}

function encodeUpdateTreasuryAddress({treasury}: any): Buffer {
  const serialized = Buffer.alloc(32);
  serialized.write(
    new PublicKey(treasury).toBuffer().toString("hex"),
    0,
    "hex"
  );
  return encodeTokenBridgeInstructionData(
    TokenBridgeInstruction.UpdateTreasuryAddress,
    serialized
  );
}

function encodeUpdateWhitelistedAddresses({whitelistAddress1, whitelistAddress2}: any): Buffer {
  const serialized = Buffer.alloc(32 * 2);
  serialized.write(
    new PublicKey(whitelistAddress1).toBuffer().toString("hex"),
    0,
    "hex"
  );
  serialized.write(
    new PublicKey(whitelistAddress2).toBuffer().toString("hex"),
    32,
    "hex"
  );
  return encodeTokenBridgeInstructionData(
    TokenBridgeInstruction.UpdateWhitelistedAddresses,
    serialized
  );
}

function encodeUpdateAdminAddress({adminAddress}: any): Buffer {
  const serialized = Buffer.alloc(32);
  serialized.write(
    new PublicKey(adminAddress).toBuffer().toString("hex"),
    0,
    "hex"
  );
  return encodeTokenBridgeInstructionData(
    TokenBridgeInstruction.UpdateAdminAddress,
    serialized
  );
}

function encodeSetPauseStatus({isPaused}: any): Buffer {
  const serialized = Buffer.alloc(1);
  serialized.writeUInt8(Number(isPaused), 0);
  return encodeTokenBridgeInstructionData(
    TokenBridgeInstruction.SetPauseStatus,
    serialized
  );
}

function encodeInitialize({bridge, treasury, admin, owner}: any): Buffer {
  const serialized = Buffer.alloc(32 * 4);
  serialized.write(
    new PublicKey(bridge).toBuffer().toString("hex"),
    0,
    "hex"
  );
  serialized.write(
    new PublicKey(treasury).toBuffer().toString("hex"),
    32,
    "hex"
  );
  serialized.write(
    new PublicKey(admin).toBuffer().toString("hex"),
    64,
    "hex"
  );
  serialized.write(
    new PublicKey(owner).toBuffer().toString("hex"),
    96,
    "hex"
  );
  return encodeTokenBridgeInstructionData(
    TokenBridgeInstruction.Initialize,
    serialized
  );
}

function encodeAttestToken({ 
  nonce,
  escrowAddress,
  transferFee,
  redeemFee,
  min,
  max,
  src,
  dst,
  w1,
  w2,
 }: any) {
  if (typeof transferFee != "bigint") {
    transferFee = BigInt(transferFee);
  }
  if (typeof redeemFee != "bigint") {
    redeemFee = BigInt(redeemFee);
  }
  if (typeof min != "bigint") {
    min = BigInt(min);
  }
  if (typeof max != "bigint") {
    max = BigInt(max);
  }
  const serialized = Buffer.alloc(134);
  serialized.writeUInt32LE(nonce, 0);
  serialized.write(
    new PublicKey(escrowAddress).toBuffer().toString("hex"),
    4,
    "hex"
  );
  serialized.writeBigInt64LE(transferFee, 36);
  serialized.writeBigInt64LE(redeemFee, 44);
  serialized.writeBigUInt64LE(min, 52);
  serialized.writeBigUInt64LE(max, 60);
  serialized.writeUInt8(Number(src), 68);
  serialized.writeUInt8(Number(dst), 69);
  serialized.write(
    new PublicKey(w1).toBuffer().toString("hex"),
    70,
    "hex"
  );
  serialized.write(
    new PublicKey(w2).toBuffer().toString("hex"),
    102,
    "hex"
  );
  return encodeTokenBridgeInstructionData(
    TokenBridgeInstruction.AttestToken,
    serialized
  );
}

function encodeCompleteNative({}: any) {
  return encodeTokenBridgeInstructionData(
    TokenBridgeInstruction.CompleteNative
  );
}

function encodeCompleteWrapped({}: any) {
  return encodeTokenBridgeInstructionData(
    TokenBridgeInstruction.CompleteWrapped
  );
}

function encodeTransferData({
  nonce,
  amount,
  fee,
  targetAddress,
  targetChain,
}: any) {
  if (typeof amount != "bigint") {
    amount = BigInt(amount);
  }
  if (typeof fee != "bigint") {
    fee = BigInt(fee);
  }
  if (!Buffer.isBuffer(targetAddress)) {
    throw new Error("targetAddress must be Buffer");
  }
  const serialized = Buffer.alloc(54);
  serialized.writeUInt32LE(nonce, 0);
  serialized.writeBigUInt64LE(amount, 4);
  serialized.writeBigUInt64LE(fee, 12);
  serialized.write(targetAddress.toString("hex"), 20, "hex");
  serialized.writeUInt16LE(targetChain, 52);
  return serialized;
}

function encodeTransferWrapped({
  nonce,
  amount,
  fee,
  targetAddress,
  targetChain,
}: any) {
  return encodeTokenBridgeInstructionData(
    TokenBridgeInstruction.TransferWrapped,
    encodeTransferData({ nonce, amount, fee, targetAddress, targetChain })
  );
}

function encodeTransferNative({
  nonce,
  amount,
  fee,
  targetAddress,
  targetChain,
}: any) {
  return encodeTokenBridgeInstructionData(
    TokenBridgeInstruction.TransferNative,
    encodeTransferData({ nonce, amount, fee, targetAddress, targetChain })
  );
}

function encodeRegisterChain({
  foreignChainId,
  endpointAddress,
  emitterAddress
}: any) {
  const serialized = Buffer.alloc(66);
  serialized.writeUInt16LE(foreignChainId, 0);
  serialized.write(
    new PublicKey(endpointAddress).toBuffer().toString("hex"),
    2,
    "hex"
  );
  serialized.write(
    new PublicKey(emitterAddress).toBuffer().toString("hex"),
    34,
    "hex"
  );
  return encodeTokenBridgeInstructionData(
    TokenBridgeInstruction.RegisterChain,
    serialized
  );
}

function encodeCreateWrapped({}: any) {
  return encodeTokenBridgeInstructionData(TokenBridgeInstruction.CreateWrapped);
}

function encodeUpgradeContract({newContract}: any) {
  const serialized = Buffer.alloc(32);
  serialized.write(
    new PublicKey(newContract).toBuffer().toString("hex"),
    0,
    "hex"
  );
  return encodeTokenBridgeInstructionData(
    TokenBridgeInstruction.UpgradeContract,
    serialized
  );
}

function encodeTransferWithPayloadData({
  nonce,
  amount,
  targetAddress,
  targetChain,
  payload,
}: any) {
  if (typeof amount != "bigint") {
    amount = BigInt(amount);
  }
  if (!Buffer.isBuffer(targetAddress)) {
    throw new Error("targetAddress must be Buffer");
  }
  if (!Buffer.isBuffer(payload)) {
    throw new Error("payload must be Buffer");
  }
  const serializedWithPayloadLen = Buffer.alloc(50);
  serializedWithPayloadLen.writeUInt32LE(nonce, 0);
  serializedWithPayloadLen.writeBigUInt64LE(amount, 4);
  serializedWithPayloadLen.write(targetAddress.toString("hex"), 12, "hex");
  serializedWithPayloadLen.writeUInt16LE(targetChain, 44);
  serializedWithPayloadLen.writeUInt32LE(payload.length, 46);
  return Buffer.concat([
    serializedWithPayloadLen,
    payload,
    Buffer.alloc(1), // option == None
  ]);
}

function encodeTransferWrappedWithPayload({
  nonce,
  amount,
  fee,
  targetAddress,
  targetChain,
  payload,
}: any) {
  return encodeTokenBridgeInstructionData(
    TokenBridgeInstruction.TransferWrappedWithPayload,
    encodeTransferWithPayloadData({
      nonce,
      amount,
      fee,
      targetAddress,
      targetChain,
      payload,
    })
  );
}

function encodeTransferNativeWithPayload({
  nonce,
  amount,
  fee,
  targetAddress,
  targetChain,
  payload,
}: any) {
  return encodeTokenBridgeInstructionData(
    TokenBridgeInstruction.TransferNativeWithPayload,
    encodeTransferWithPayloadData({
      nonce,
      amount,
      fee,
      targetAddress,
      targetChain,
      payload,
    })
  );
}
