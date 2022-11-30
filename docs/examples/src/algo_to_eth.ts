import { ethers } from "ethers";
import algosdk, { Account, Algodv2, assignGroupID, waitForConfirmation } from "algosdk";
import { transferFromAlgorand, nativeToHexString, CHAIN_ID_ETH, getEmitterAddressAlgorand, parseSequenceFromLogAlgorand, redeemOnEth } from "@algo-foundry/messina-sdk";
import { TransactionSignerPair } from "@algo-foundry/messina-sdk/lib/cjs/algorand";
import { getSignedVAA } from "@algo-foundry/messina-sdk/lib/cjs/rpc/getSignedVAAUpdate";

//algorand
const ALGO_TOKEN = "";
const ALGO_ADDRESS = "";
const ALGO_PORT = "";
const ALGO_MNEMONIC = "";

//contract
const ALGO_BRIDGE_ID = 0;
const ALGO_CORE_ID = 0;
const ETH_BRIDGE_ADRESS = "";

//ethereum
const ETH_NODE_URL = "";
const ETH_PRIVATE_KEY = "";

//guardian
const GUARDIAN_GRPC = "";

//algorand asset details
const ASSET_ID = 0;
const ASSET_DECIMALS = 0;
const AMOUNT_TO_TRANSFER = 0;

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

async function main(): Promise<void> {
  try{
    console.log("INITIATE ALGO CLIENT");  
    const client: algosdk.Algodv2 = new Algodv2(ALGO_TOKEN, ALGO_ADDRESS, ALGO_PORT);
    const wallet: Account = algosdk.mnemonicToSecretKey(ALGO_MNEMONIC)
    
    console.log("INITIATE ETHERS CLIENT");
    const provider = new ethers.providers.WebSocketProvider(ETH_NODE_URL) as any;   
    const signer = new ethers.Wallet(ETH_PRIVATE_KEY, provider);
    
    const hexStr = nativeToHexString(
          signer.address,
          CHAIN_ID_ETH
        );
    
    if (!hexStr) {
       throw new Error("Failed to convert to hexStr");
     }    
   
    console.log("TRANSFER FROM ALGORAND");  
    const transferTxs = await transferFromAlgorand(
          client,
          BigInt(ALGO_BRIDGE_ID),
          BigInt(ALGO_CORE_ID),
          wallet.addr,
          BigInt(ASSET_ID),
          BigInt(AMOUNT_TO_TRANSFER * Math.pow(10, ASSET_DECIMALS)), // AMOUNT_TO_TRANSFER * (10 ^ ASSET_DECIMALS)
          hexStr,
          CHAIN_ID_ETH,
          BigInt(0)
        );
    
    console.log("SIGN SEND CONFIRM");    
    const transferResult = await signSendAndConfirmAlgorand(
          client,
          transferTxs,
          wallet,
          4
        );
    
    console.log("GET EMITTER"); 
    const emitterAddr = getEmitterAddressAlgorand(BigInt(ALGO_BRIDGE_ID));

    console.log("PARSE SEQUENCE"); 
    const sequence = await parseSequenceFromLogAlgorand(transferResult);
    
    console.log("SIGNED VAA"); 
    let signedVAA = await getSignedVAA(GUARDIAN_GRPC, emitterAddr, 'CHAIN_ID_ALGORAND', sequence, 1000, 5);
    // @ts-ignore
    const vaaBytes = new Uint8Array(signedVAA!.match(/.{1,2}/g)!.map((byte: any) => parseInt(byte, 16)));
    
    console.log("REDEEM ETH");  
    const redeem = await redeemOnEth(
          ETH_BRIDGE_ADRESS,
          signer, // Wallet from ethers js
          vaaBytes
        );

    console.log("SUCCESSFULLY REDEEM =>" +redeem);  
        
  }catch(e){
    console.log("ERROR => " + e);
  }
}

main();