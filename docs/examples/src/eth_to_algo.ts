import { ethers } from "ethers";
import algosdk, { Account, Algodv2, assignGroupID, waitForConfirmation } from "algosdk";
import { approveEth, redeemOnAlgorand, transferFromEth, getEmitterAddressEth, parseSequenceFromLogEth } from "@algo-foundry/messina-sdk";
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
// algo chain id
const CHAIN_ID_ALGO = 8;

// eth rpc
const ETH_NODE_URL = "";
// eth private key
const ETH_PRIVATE_KEY = "";

// eth contracts
const CORE_ADDRESS = "";
const TOKEN_BRIDGE_ADDRESS = "";

// guardian host
const GUARDIAN_GRPC = "";
// eth asset details
const ethAsset = "";
const ethDecimals = 18;
// amount to transfer
const AMOUNT_TO_TRANSFER = 0;

async function main(): Promise<void> {
  try {
    console.log("Create algo client");
    const client: algosdk.Algodv2 = getAlgoClient();
    console.log("Create algo wallet");
    const wallet: Account = algosdk.mnemonicToSecretKey(ALGO_MNEMONIC_TEST)

    console.log("Create eth provider");
    const provider = new ethers.providers.WebSocketProvider(
      ETH_NODE_URL
    ) as any;
    console.log("Create eth wallet");
    const signer = new ethers.Wallet(ETH_PRIVATE_KEY, provider);

    console.log("Send allowance");
    await approveEth(
      TOKEN_BRIDGE_ADDRESS,
      ethAsset,
      signer,
      BigInt(AMOUNT_TO_TRANSFER * Math.pow(10, ethDecimals))
    );

    console.log("Transfer from eth");
    const receipt: ethers.ContractReceipt = await transferFromEth(
      TOKEN_BRIDGE_ADDRESS,
      signer,
      ethAsset,
      BigInt(AMOUNT_TO_TRANSFER * Math.pow(10, ethDecimals)),
      CHAIN_ID_ALGO,
      algosdk.decodeAddress(wallet.addr).publicKey
    );

    console.log("parseSequenceFromLogEth");
    const sequence: string = parseSequenceFromLogEth(receipt, CORE_ADDRESS);

    console.log("Getting emitter address...");
    const emitterAddr = getEmitterAddressEth(TOKEN_BRIDGE_ADDRESS);

    //Only for localhost ganache (remove if use infura)
    let interval = setInterval(async () => {
      await provider.send('evm_mine')
    }, 1000)

    console.log("BRIDGING ETH -> ALGO: getSignedVAA");
    const signedVAA = await getSignedVAA(GUARDIAN_GRPC, emitterAddr, 'CHAIN_ID_ETHEREUM', sequence, 1000, 20)

    //Only for localhost ganache (remove if use infura)
    clearInterval(interval)

    console.log("BRIDGING ETH -> ALGO: parseSignedVaa");
    // @ts-ignore
    const vaaBytes = new Uint8Array(signedVAA!.match(/.{1,2}/g)!.map((byte: any) => parseInt(byte, 16)))

    console.log("Redeeming");
    const redeemTxs = await redeemOnAlgorand(
      client,
      BigInt(TOKEN_BRIDGE_ID),
      BigInt(CORE_ID),
      vaaBytes,
      wallet.addr
    );

    console.log("signSendAndConfirmAlgorand Transaction");
    await signSendAndConfirmAlgorand(client, redeemTxs, wallet, 4);

    console.log("BRIDGING ETH -> ALGO: Successfully redeem " + redeemTxs);
  } catch (e) {
    console.log(e);
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

