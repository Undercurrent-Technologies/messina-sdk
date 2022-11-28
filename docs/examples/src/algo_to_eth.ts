import { ethers } from "ethers";
import algosdk, { Account, Algodv2, assignGroupID, waitForConfirmation } from "algosdk";
import { redeemOnEth, transferFromAlgorand, parseSequenceFromLogAlgorand, getEmitterAddressAlgorand, nativeToHexString } from "@algo-foundry/messina-sdk";
import { getSignedVAA } from "@algo-foundry/messina-sdk/lib/cjs/rpc/getSignedVAAUpdate";
import { TransactionSignerPair } from "@algo-foundry/messina-sdk/lib/cjs/algorand";

// algo node token
const ALGO_TOKEN = "";
// algo node host
const ALGOD_ADDRESS = "";
// algo node port
const ALGOD_PORT = 0;
// algo account mnemonic
const ALGO_MNEMONIC_TEST = "";

// algo contracts
const CORE_ID = 0;
const TOKEN_BRIDGE_ID = 0;

// eth rpc
const ETH_NODE_URL = "";
// eth chain id
const CHAIN_ID_ETH = 2;
// eth private key
const ETH_PRIVATE_KEY = "";
// eth token bridge
const TOKEN_BRIDGE_ADDRESS = "";

// guardian host
const GUARDIAN_GRPC = "";
// algo asset details
const ASSET_ID = 0;
const ASSET_DECIMAL = 0;
// amount to transfer
const AMOUNT_TO_TRANSFER = 0;

async function main(): Promise<void> {
  try {
    console.log("Create algo client")
    const client: algosdk.Algodv2 = getAlgoClient();
    console.log("Create algo wallet");
    const wallet: Account = algosdk.mnemonicToSecretKey(ALGO_MNEMONIC_TEST)

    console.log("Create eth provider")
    const provider = new ethers.providers.WebSocketProvider(
      ETH_NODE_URL
    ) as any;
    console.log("Create eth wallet")
    const signer = new ethers.Wallet(ETH_PRIVATE_KEY, provider);

    console.log("Getting emitter address...");
    const emitterAddr = getEmitterAddressAlgorand(BigInt(TOKEN_BRIDGE_ID));

    console.log("Start transfer from Algorand to Ethereum")
    const hexStr = nativeToHexString(
      signer.address,
      CHAIN_ID_ETH
    );

    if (!hexStr) {
      throw new Error("Failed to convert to hexStr");
    }

    console.log("BRIDGING ALGO -> ETH: transferFromAlgorand");
    const transferTxs = await transferFromAlgorand(
      client,
      BigInt(TOKEN_BRIDGE_ID),
      BigInt(CORE_ID),
      wallet.addr,
      BigInt(ASSET_ID),
      BigInt(AMOUNT_TO_TRANSFER * Math.pow(10, ASSET_DECIMAL)),
      hexStr,
      CHAIN_ID_ETH,
      BigInt(0)
    );

    console.log("BRIDGING ALGO -> ETH: signAlgorandTransaction")
    const transferResult = await signSendAndConfirmAlgorand(
      client,
      transferTxs,
      wallet,
      4
    );

    console.log("BRIDGING ALGO -> ETH: getSequenceNumber")
    const txSid = parseSequenceFromLogAlgorand(transferResult);

    console.log("BRIDGING ALGO -> ETH: getSignedVAA")
    let signedVAA = await getSignedVAA(GUARDIAN_GRPC, emitterAddr, 'CHAIN_ID_ALGORAND', txSid, 1000, 5)

    console.log("BRIDGING ALGO -> ETH: parseSignedVaa")
    // @ts-ignore
    const vaaBytes = new Uint8Array(signedVAA!.match(/.{1,2}/g)!.map((byte: any) => parseInt(byte, 16)))

    console.log("BRIDGING ALGO -> ETH: redeemOnEth to receive the asset")
    const redeem = await redeemOnEth(
      TOKEN_BRIDGE_ADDRESS,
      signer,
      vaaBytes
    );

    console.log("BRIDGING ALGO -> ETH: success => " + redeem.transactionHash)
  } catch (e) {
    console.log("ERROR => " + e);
  }
}

function getAlgoClient(): Algodv2 {
  const algodClient = new Algodv2(ALGO_TOKEN, ALGOD_ADDRESS, ALGOD_PORT);
  return algodClient;
}

async function signSendAndConfirmAlgorand(
  algodClient: Algodv2,
  txs: TransactionSignerPair[],
  wallet: Account,
  waitRounds = 1
) {
  assignGroupID(txs.map((tx) => tx.tx));
  const signedTxns: Uint8Array[] = [];
  for (const tx of txs) {
    if (tx.signer) {
      signedTxns.push(await tx.signer.signTxn(tx.tx));
    } else {
      signedTxns.push(tx.tx.signTxn(wallet.sk));
    }
  }
  await algodClient.sendRawTransaction(signedTxns).do();

  const result = await waitForConfirmation(
    algodClient,
    txs[txs.length - 1].tx.txID(),
    waitRounds
  );
  return result;
}

main();
