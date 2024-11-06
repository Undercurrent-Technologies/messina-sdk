import { ethers } from "ethers";
import { approveEth, CHAIN_ID_AVAX, CHAIN_ID_ETH, EVMChainId, getAllowanceEth, getEmitterAddressEth, parseSequenceFromLogEth, redeemOnEthWithType, transferFromEth, tryNativeToUint8Array } from "@algo-foundry/messina-sdk";
import { getSignedVAA } from "@algo-foundry/messina-sdk/lib/cjs/rpc/getSignedVAAUpdate";

//contract
const ETH_BRIDGE_ADDRESS = "0xC74303104E4aa5833A59767d59e958f4a0F308D4";
const ETH_CORE_ADDRESS = "0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B";

//ethereum
const ETH_NODE_URL = "";
const ETH_PRIVATE_KEY = "";

//guardian
const GUARDIAN_GRPC = "";

//avalanche asset details
const AVAX_BRIDGE_ADDRESS = "0x201a2F5e03b83B542E617b3004379C8691254c0A";
const TOKEN_ADDRESS = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
const ASSET_DECIMALS = 6;
const AMOUNT_TO_TRANSFER = 10;

async function main(): Promise<void> {
  try {
    console.log("INITIATE ETHERS CLIENT");
    const provider = new ethers.providers.WebSocketProvider(ETH_NODE_URL) as any;
    const signer = new ethers.Wallet(ETH_PRIVATE_KEY, provider);

    console.log("CHECK ALLOWANCE");
    const allowance: ethers.BigNumber = await getAllowanceEth(ETH_BRIDGE_ADDRESS, TOKEN_ADDRESS, signer);

    console.log("APPROVE ALLOWANCE");
    if (allowance.lt(AMOUNT_TO_TRANSFER)) {
      await approveEth(
        ETH_BRIDGE_ADDRESS,
        TOKEN_ADDRESS,
        signer,
        BigInt(AMOUNT_TO_TRANSFER * Math.pow(10, ASSET_DECIMALS))
      );
    }

    console.log("TRANSFER FROM ETH");
    const receipt: ethers.ContractReceipt = await transferFromEth(
      ETH_BRIDGE_ADDRESS,
      signer,
      TOKEN_ADDRESS,
      BigInt(AMOUNT_TO_TRANSFER * Math.pow(10, ASSET_DECIMALS)), // AMOUNT_TO_TRANSFER * (10 ^ ASSET_DECIMALS)
      CHAIN_ID_AVAX,
      tryNativeToUint8Array(signer.address, CHAIN_ID_AVAX),
      "WORMHOLE"
    );

    console.log("GET EMITTER ADDRESS");
    const emitterAddr = getEmitterAddressEth(ETH_BRIDGE_ADDRESS);
    console.log("PARSE SEQUENCE");
    const sequence: string = parseSequenceFromLogEth(receipt, ETH_CORE_ADDRESS);

    let interval = setInterval(async () => {
      await provider.send('evm_mine')
    }, 1000)

    console.log("SIGNED VAA");
    const signedVAA = await getSignedVAA(GUARDIAN_GRPC, emitterAddr, 'CHAIN_ID_ETHEREUM', sequence, 1000, 20)

    clearInterval(interval)

    // @ts-ignore
    const vaaBytes = new Uint8Array(signedVAA!.match(/.{1,2}/g)!.map((byte: any) => parseInt(byte, 16)))

    const cctpMessage = await getCCTPAttestation(provider, receipt.transactionHash)

    console.log("REDEEM ETH");
    const redeem = await redeemOnEthWithType(
      AVAX_BRIDGE_ADDRESS,
      signer, // Wallet from ethers js
      vaaBytes,
      "CCTP",
      cctpMessage,
      "WORMHOLE"
    );

    console.log("SUCCESSFULLY REDEEM =>" + redeem);

  } catch (e) {
    console.log("ERROR => " + e);
  }
}

async function getCCTPAttestation(
  provider: ethers.providers.WebSocketProvider,
  transactionHash: string,
): Promise<string> {
  const eventTopic = '0x8c5261668696ce22758910d05bab8f186d6eb247ceac2af2e82c7dc17669b036'

  const transferReceipt = await provider.getTransactionReceipt(transactionHash)

  const cctpLog = transferReceipt.logs.find((log) => log.topics[0] === eventTopic)
  const circleBridgeMessage = ethers.utils.defaultAbiCoder.decode(
    ['bytes'],
    (cctpLog as ethers.providers.Log).data,
  )[0]
  const cctpMessageHash = ethers.utils.keccak256(circleBridgeMessage)

  const response = await fetch(
    `https://iris-api.circle.com/attestations/${cctpMessageHash}`,
  )

  if (response.status != 200) {
    return ''
  }

  const jsonResponse = await response.json()
  return jsonResponse.status === 'complete'
    ? circleBridgeMessage + jsonResponse.attestation.substring(2)
    : ''
}

main();
