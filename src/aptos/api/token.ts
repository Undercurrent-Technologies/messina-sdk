import { exec } from "child_process";
import { randomBytes } from "crypto";
import { rm } from "fs";
import { mkdir, readFile, writeFile } from "fs/promises";
import { Account, AccountData, Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';
import { Types } from "aptos";

export const createToken = (
  tokenBridgeAddress: string,
  type: string,
  name: string,
  symbol: string,
  decimal: number,
  totalSupply: string,
): Types.EntryFunctionPayload => {
  if (!tokenBridgeAddress) throw new Error("Need token bridge address.");
  return {
    function: `${tokenBridgeAddress}::create_token::create_token`,
    type_arguments: [type],
    arguments: [name, symbol, decimal, totalSupply],
  };
};

export type PublishTokenResult = {
  error: string
  publishPackageTxBytes: Uint8Array
  type: string
}

export const publishToken = async (
  userAddr: string,
  symbol: string, 
): Promise<PublishTokenResult> => {
  var result: PublishTokenResult = {
    type: '',
    publishPackageTxBytes: new Uint8Array(),
    error: '',
  }
  const aptos = new Aptos(new AptosConfig({ network: Network.TESTNET }));

  let accountInfo: AccountData;
  try {
    accountInfo = await aptos.account.getAccountInfo({
      accountAddress: userAddr
    });
  } catch (error) {
    console.error({ error }, 'get account info error');
    result.error = 'Get account info failed. Please try again later.'
    return result;
  }

  const seq = accountInfo.sequence_number
  const unique = randBytesStr(4)

  const type = `${userAddr}::${symbol}${unique}::${symbol}`
  const code = `module ${userAddr}::${symbol}${unique} {
    struct ${symbol} {}
  }`;
  let metadata: string;
  let byteCode: string[];
  try {
    ({ metadata, byteCode } = await buildToken(userAddr, code));
  } catch (error) {
    console.error({ error }, 'build token error');
    result.error = 'Build token failed. Please try again later.';
    return result
  }

  let publishPackageTxBytes: Uint8Array;
  try {
    
    publishPackageTxBytes = await aptos
      .publishPackageTransaction({
        account: userAddr,
        metadataBytes: metadata,
        moduleBytecode: byteCode,
        options: {
          accountSequenceNumber: BigInt(seq),
          expireTimestamp: Date.now() + 10 * 60_000 // 10 minutes
        }
      })
      .then(tx => tx.bcsToBytes());
  } catch (error) {
    console.error({ error }, 'publish package transaction error');
    result.error = 'Error publish package transaction. Please try again later.'
    return result;
  }

  result.publishPackageTxBytes = publishPackageTxBytes
  result.type = type
  return result
}

const randBytesStr = (length: number) => {
  const chars = "abcdefghijklmnopqrstuvwxyz";
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
};

const manifest = () => `[package]
name = "token_${randBytesStr(4)}"
version = "1.0.0"`;

const buildToken = async (userAddr: string, code: string) => {
  const moduleDir = `${userAddr}_${randBytesStr(4)}`;
  await mkdir(`./__token__/${moduleDir}/sources`, { recursive: true });
  await Promise.all([
    writeFile(`./__token__/${moduleDir}/Move.toml`, manifest()),
    writeFile(`./__token__/${moduleDir}/sources/Token.move`, code)
  ]);
  await new Promise<void>((resolve, reject) => {
    exec(
      `aptos move build-publish-payload --json-output-file ./__token__/${moduleDir}/payload.json --package-dir ./__token__/${moduleDir} --assume-yes`,
      e => {
        if (e) {
          reject(e);
          return;
        }
        resolve();
      }
    );
  });
  const data = await readFile(`./__token__/${moduleDir}/payload.json`, 'utf8');
  rm(
    `./__token__/${moduleDir}`,
    {
      recursive: true,
      force: true
    },
    () => {
      // do nothing
    }
  );
  const jsonData = JSON.parse(data) as {
    args: [{ value: string }, { value: string[] }];
  };
  const metadata = jsonData.args[0].value;
  const byteCode = jsonData.args[1].value;
  return { metadata, byteCode };
};

const numberToAlpha = (num: number): string => {
  let result = "";
  while (num > 0) {
      num--; // Menyesuaikan ke indeks 0-based
      let remainder = num % 26;
      result = String.fromCharCode(97 + remainder) + result; // 97 adalah 'a' dalam ASCII
      num = Math.floor(num / 26);
  }
  return result;
}