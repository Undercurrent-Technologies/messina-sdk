import { BigNumber } from "@ethersproject/bignumber";
import { ChainId } from "./consts";

export const METADATA_REPLACE = new RegExp("\u0000", "g");

export function readUInt96BE(buffer: Buffer, offset = 0): BigNumber {
  // We read 96 bits, 12 bytes
  const data = buffer.slice(offset, offset + 12);
  // We construct a big number from this data
  const num = BigNumber.from(data);
  return num;
}

// note: actual first byte is message type
//     0       [u8; 32] token address
//     32      u16      token chain
//     34      [u8; 32] symbol
//     66      [u8; 32] name
//     98      u256     tokenId
//     100     u16      standardId
//     101     u8       tokenTypeId 1 for 721, 2 for 1155
//     103     u16      tokenIDs[] length
//     xxx     u256[]   tokenIDs[]
//     xxx+2   u16      amounts[] length
//     yyy     u256[]   amounts[]
//     yyy+32  [u8; 32] royaltyAddress
//     prev+12 u96      royaltyBips
//     prev+32 [u8; 32] rentAddress
//     prev+32 u256     rentExpiryDate
//     prev+2  u16      uri length
//     prev+?? string   uri 
//     prev+32 [u8; 32] toAddress
//     prev+2   u16     toChain
//     prev+2   u16     createData length
//     prev+??  bytes   createData
//     prev+2   u16     mintData length
//     prev+??  bytes   mintData

export const parseNFTPayload = (arr: Buffer) => {
  let index = 1;
  const originAddress = arr.slice(index, index + 32).toString("hex");
  index += 32;

  const originChain = arr.readUInt16BE(index) as ChainId;
  index += 2;

  const symbol = Buffer.from(arr.slice(index, index + 32))
    .toString('utf8')
    .replace(METADATA_REPLACE, '')
  index += 32

  const name = Buffer.from(arr.slice(index, index + 32))
    .toString('utf8')
    .replace(METADATA_REPLACE, '')
  index += 32

  const tokenId = BigNumber.from(arr.slice(index, index + 32))
  index += 32

  const standardId = arr.readInt16BE(index)
  index += 2

  const collectionOwner = arr.slice(index, index + 32).toString('hex')
  index += 32

  const tokenTypeId = arr.readInt8(index)
  index += 1

  const tokenIdsLen = arr.readInt16BE(index)
  index += 2

  const tokenIds: BigNumber[] = []
  for (let i = 0; i < tokenIdsLen; i++) {
    const tempTokenId = BigNumber.from(arr.slice(index, index + 32))
    tokenIds.push(tempTokenId)
    index += 32
  }

  const amountsLen = arr.readInt16BE(index)
  index += 2

  const amounts: BigNumber[] = []
  for (let i = 0; i < amountsLen; i++) {
    const tempAmount = BigNumber.from(arr.slice(index, index + 32))
    amounts.push(tempAmount)
    index += 32
  }

  const royaltyAddress = arr.slice(index, index + 32).toString('hex')
  index += 32

  const royaltyBips = readUInt96BE(arr, index)
  index += 12

  const rentAddress = arr.slice(index, index + 32).toString('hex')
  index += 32

  const rentExpiryDate = BigNumber.from(arr.slice(index, index + 32))
  index += 32

  const uri_len = arr.readInt16BE(index)
  index += 2

  const uri = Buffer.from(arr.slice(index, index + uri_len))
    .toString('utf8')
    .replace(METADATA_REPLACE, '')
  index += uri_len

  const toAddress = arr.slice(index, index + 32).toString('hex')
  index += 32

  const toChain = arr.readUInt16BE(index) as ChainId
  index += 2

  const createDataLen = arr.readInt16BE(index)
  index += 2

  const createData = arr.slice(index, index + createDataLen).toString('hex')
  index += createDataLen

  const mintDataLen = arr.readInt16BE(index)
  index += 2

  const mintData = arr.slice(index, index + mintDataLen).toString('hex')

  return {
    originAddress,
    originChain,
    symbol,
    name,
    tokenId,
    standardId,
    collectionOwner,
    tokenTypeId,
    tokenIds,
    amounts,
    royaltyAddress,
    royaltyBips,
    rentAddress,
    rentExpiryDate,
    uri,
    toAddress,
    toChain,
    createData,
    mintData,
  }
}

//     0   u256     amount
//     32  [u8; 32] token_address
//     64  u16      token_chain
//     66  [u8; 32] recipient
//     98  u16      recipient_chain
//     100 u256     fee
export const parseTransferPayload = (arr: Buffer) => ({
  amount: BigNumber.from(arr.slice(1, 1 + 32)).toBigInt(),
  originAddress: arr.slice(33, 33 + 32).toString("hex"),
  originChain: arr.readUInt16BE(65) as ChainId,
  targetAddress: arr.slice(67, 67 + 32).toString("hex"),
  targetChain: arr.readUInt16BE(99) as ChainId,
  fee: BigNumber.from(arr.slice(101, 101 + 32)).toBigInt(),
});

export const parseCCTPTransferPayload = (arr: Buffer) => {
  let index = 1;
  const token = arr.slice(index, index + 32).toString("hex");
  index += 32;

  const amount = BigNumber.from(arr.slice(index, index + 32));
  index += 32;

  const sourceDomain = arr.readUInt32BE(index);
  index += 4;

  const targetDomain = arr.readUInt32BE(index);
  index += 4;

  const nonce = arr.readBigUint64BE(index);
  index += 8;

  const fromAddress = arr.slice(index, index + 32).toString('hex');
  index += 32;

  const mintRecipient = arr.slice(index, index + 32).toString('hex');
  index += 32;

  const finalRecipient = arr.slice(index, index + 32).toString('hex');
  index += 32;

  const targetChain = arr.readUInt16BE(index);
  index += 2;

  const arbiterFee = BigNumber.from(arr.slice(index, index + 32));
  index += 32;

  const payloadLen = arr.readInt16BE(index);
  index += 2;

  const payload = arr.slice(index, index + payloadLen).toString('hex');

  return {
    token,
    amount,
    sourceDomain,
    targetDomain,
    nonce,
    fromAddress,
    mintRecipient,
    finalRecipient,
    targetChain,
    arbiterFee,
    payload,
  }
}

//This returns a corrected amount, which accounts for the difference between the VAA
//decimals, and the decimals of the asset.
// const normalizeVaaAmount = (
//   amount: bigint,
//   assetDecimals: number
// ): bigint => {
//   const MAX_VAA_DECIMALS = 8;
//   if (assetDecimals <= MAX_VAA_DECIMALS) {
//     return amount;
//   }
//   const decimalStringVaa = formatUnits(amount, MAX_VAA_DECIMALS);
//   const normalizedAmount = parseUnits(decimalStringVaa, assetDecimals);
//   const normalizedBigInt = BigInt(truncate(normalizedAmount.toString(), 0));

//   return normalizedBigInt;
// };

// function truncate(str: string, maxDecimalDigits: number) {
//   if (str.includes(".")) {
//     const parts = str.split(".");
//     return parts[0] + "." + parts[1].slice(0, maxDecimalDigits);
//   }
//   return str;
// }
