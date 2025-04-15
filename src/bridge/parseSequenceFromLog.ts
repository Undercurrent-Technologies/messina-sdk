// import { TxInfo } from "@terra-money/terra.js";
import algosdk from "algosdk";
import { BigNumber, ContractReceipt } from "ethers";
import { Implementation__factory } from "../ethers-contracts";
import { TransactionResponse, VersionedTransactionResponse } from "@solana/web3.js";
import { Types } from "aptos";

export function parseSequenceFromLogEth(
  receipt: ContractReceipt,
  bridgeAddress: string
): string {
  // TODO: dangerous!(?)
  const bridgeLog = receipt.logs.filter((l) => {
    return l.address === bridgeAddress;
  })[0];
  const {
    args: { sequence },
  } = Implementation__factory.createInterface().parseLog(bridgeLog);
  return sequence.toString();
}

export function parseSequencesFromLogEth(
  receipt: ContractReceipt,
  bridgeAddress: string
): string[] {
  // TODO: dangerous!(?)
  const bridgeLogs = receipt.logs.filter((l) => {
    return l.address === bridgeAddress;
  });
  return bridgeLogs.map((bridgeLog) => {
    const {
      args: { sequence },
    } = Implementation__factory.createInterface().parseLog(bridgeLog);
    return sequence.toString();
  });
}

export function parseSequenceFromLogTerra(info: any): string {
  // Scan for the Sequence attribute in all the outputs of the transaction.
  // TODO: Make this not horrible.
  let sequence = "";
  const jsonLog = JSON.parse(info.raw_log);
  jsonLog.map((row: any) => {
    row.events.map((event: any) => {
      event.attributes.map((attribute: any) => {
        if (attribute.key === "message.sequence") {
          sequence = attribute.value;
        }
      });
    });
  });
  return sequence.toString();
}

export function parseSequencesFromLogTerra(info: any): string[] {
  // Scan for the Sequence attribute in all the outputs of the transaction.
  // TODO: Make this not horrible.
  const sequences: string[] = [];
  const jsonLog = JSON.parse(info.raw_log);
  jsonLog.map((row: any) => {
    row.events.map((event: any) => {
      event.attributes.map((attribute: any) => {
        if (attribute.key === "message.sequence") {
          sequences.push(attribute.value.toString());
        }
      });
    });
  });
  return sequences;
}

export function parseSequenceFromLogAlgorand(
  result: Record<string, any>
): string {
  let sequence = "";
  if (result["inner-txns"]) {
    const innerTxns: [] = result["inner-txns"];
    class iTxn {
      "local-state-delta": [[Object]];
      logs: Buffer[] | undefined;
      "pool-eror": string;
      txn: { txn: [Object] } | undefined;
    }
    innerTxns.forEach((txn: iTxn) => {
      if (txn.logs) {
        try {
          sequence = BigNumber.from(txn.logs[0].slice(0, 8)).toString();
        } catch (e) {
          // Support indexer logs
          sequence = algosdk.decodeUint64(Buffer.from(txn.logs[0].toString(), "base64"), "safe").toString();
        }
      }
    });
  }
  return sequence;
}

const SOLANA_SEQ_LOG = "Program log: Sequence: ";
export function parseSequenceFromLogSolana(
  info: TransactionResponse | VersionedTransactionResponse
) {
  // TODO: better parsing, safer
  const sequence = info.meta?.logMessages
    ?.filter((msg) => msg.startsWith(SOLANA_SEQ_LOG))?.[0]
    ?.replace(SOLANA_SEQ_LOG, "");
  if (!sequence) {
    throw new Error("sequence not found");
  }
  return sequence.toString();
}

/**
 * Given a transaction result, return the first WormholeMessage event sequence
 * @param coreBridgeAddress Wormhole Core bridge address
 * @param result the result of client.waitForTransactionWithResult(txHash)
 * @returns sequence
 */
export function parseSequenceFromLogAptos(
  coreBridgeAddress: string,
  result: Types.UserTransaction
): string | null {
  if (result.success) {
    const event = result.events.find(
      (e) => e.type === `${coreBridgeAddress}::state::WormholeMessage`
    );
    return event?.data.sequence || null;
  }

  return null;
}
