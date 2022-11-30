import { ethers } from "ethers";
import algosdk, { Account, Algodv2, assignGroupID, waitForConfirmation } from "algosdk";
import { approveEth, transferFromEth, CHAIN_ID_ALGORAND, getEmitterAddressEth, parseSequenceFromLogEth, redeemOnAlgorand, getAllowanceEth } from "@algo-foundry/messina-sdk";
import { getSignedVAA } from "@algo-foundry/messina-sdk/lib/cjs/rpc/getSignedVAAUpdate";
import { TransactionSignerPair } from "@algo-foundry/messina-sdk/lib/cjs/algorand";

//algorand
const ALGO_TOKEN = "";
const ALGO_ADDRESS = "";
const ALGO_PORT = "";
const ALGO_MNEMONIC = "";

//contract
const ALGO_BRIDGE_ID = 0;
const ALGO_CORE_ID = 0;

const ETH_BRIDGE_ADRESS = "";
const ETH_CORE_ADRESS = "";

//ethereum
const ETH_NODE_URL = "";
const ETH_PRIVATE_KEY = "";

//guardian
const GUARDIAN_GRPC = "";

//algorand asset details
const TOKEN_ADDRESS = "";
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
    const client: algosdk.Algodv2 = new Algodv2(ALGO_TOKEN, ALGO_ADDRESS, ALGO_PORT);
    const wallet: Account = algosdk.mnemonicToSecretKey(ALGO_MNEMONIC)
    
    const provider = new ethers.providers.WebSocketProvider(ETH_NODE_URL) as any;   
    const signer = new ethers.Wallet(ETH_PRIVATE_KEY, provider);
    
    console.log("CHECK ALLOWANCE");
    const allowance: ethers.BigNumber = await getAllowanceEth(ETH_BRIDGE_ADRESS,TOKEN_ADDRESS, signer);
    
    console.log("APPROVE ALLOWANCE"); 
    if(allowance.lt(AMOUNT_TO_TRANSFER)){
      await approveEth(
        ETH_BRIDGE_ADRESS,
        TOKEN_ADDRESS,
        signer,
        BigInt(AMOUNT_TO_TRANSFER * Math.pow(10, ASSET_DECIMALS))
      );
    }

    await approveEth(
      ETH_BRIDGE_ADRESS,
      TOKEN_ADDRESS,
      signer,
      BigInt(AMOUNT_TO_TRANSFER * Math.pow(10, ASSET_DECIMALS))
    );

    console.log("TRANSFER FROM ETH"); 
    const receipt: ethers.ContractReceipt = await transferFromEth(
          ETH_BRIDGE_ADRESS,
          signer, 
          TOKEN_ADDRESS,
          BigInt(AMOUNT_TO_TRANSFER * Math.pow(10, ASSET_DECIMALS)), // AMOUNT_TO_TRANSFER * (10 ^ ASSET_DECIMALS)
          CHAIN_ID_ALGORAND,
          algosdk.decodeAddress(wallet.addr).publicKey
      );
    
    console.log("GET EMITTER ADDRESS"); 
    const emitterAddr = getEmitterAddressEth(ETH_BRIDGE_ADRESS);
    console.log("PARSE SEQUENCE");  
    const sequence: string = parseSequenceFromLogEth(receipt, ETH_CORE_ADRESS);
   
    let interval = setInterval(async () => {
      await provider.send('evm_mine')
    }, 1000)

    console.log("SIGNED VAA");  
    const signedVAA = await getSignedVAA(GUARDIAN_GRPC, emitterAddr, 'CHAIN_ID_ETHEREUM', sequence, 1000, 20)

    clearInterval(interval)

    // @ts-ignore
    const vaaBytes = new Uint8Array(signedVAA!.match(/.{1,2}/g)!.map((byte: any) => parseInt(byte, 16)))
    
    const redeemTxs = await redeemOnAlgorand(
          client, 
          BigInt(ALGO_BRIDGE_ID),
          BigInt(ALGO_CORE_ID),
          vaaBytes,
          wallet.addr
        );
    
    await signSendAndConfirmAlgorand(client, redeemTxs, wallet, 4);

    console.log("SUCCESSFULLY REDEEM =>" +redeemTxs);  

  }catch(e){
    console.log("ERROR => " + e);
  }
}

main();