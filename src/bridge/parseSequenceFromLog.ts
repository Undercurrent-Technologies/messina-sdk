// import { TxInfo } from "@terra-money/terra.js";
import algosdk from "algosdk";
import { BigNumber, ContractReceipt } from "ethers";
import { Implementation__factory } from "../ethers-contracts";

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
