import { Algodv2 } from "algosdk";
import { ethers, Overrides } from "ethers";
import { TransactionSignerPair, _submitVAAAlgorand } from "../algorand";
import { BridgeImplementationV2__factory } from "../ethers-contracts";

export async function redeemOnEth(
  tokenBridgeAddress: string,
  signer: ethers.Signer,
  signedVAA: Uint8Array,
  network: string,
  overrides: Overrides & { from?: string | Promise<string> } = {}
) {
  const bridge = BridgeImplementationV2__factory.connect(tokenBridgeAddress, signer);
  const v = await bridge.completeTransfer(signedVAA, network, overrides);
  const receipt = await v.wait();
  return receipt;
}


export async function redeemOnEthWithType(
  tokenBridgeAddress: string,
  signer: ethers.Signer,
  signedVAA: Uint8Array,
  messageType: string,
  messagePayload: string,
  network: string,
  overrides: Overrides & { from?: string | Promise<string> } = {}
) {
  const bridge = BridgeImplementationV2__factory.connect(tokenBridgeAddress, signer);
  const v = await bridge.completeTransferWithType(signedVAA, {
    messageType: messageType,
    messagePayload: messagePayload
  }, network, overrides);
  const receipt = await v.wait();
  return receipt;
}


// export async function redeemOnEthNative(
//   tokenBridgeAddress: string,
//   signer: ethers.Signer,
//   signedVAA: Uint8Array,
//   overrides: Overrides & { from?: string | Promise<string> } = {}
// ) {
//   const bridge = BridgeImplementationV2__factory.connect(tokenBridgeAddress, signer);
//   const v = await bridge.completeTransferAndUnwrapETH(signedVAA, overrides);
//   const receipt = await v.wait();
//   return receipt;
// }

/**
 * This basically just submits the VAA to Algorand
 * @param client AlgodV2 client
 * @param tokenBridgeId Token bridge ID
 * @param bridgeId Core bridge ID
 * @param vaa The VAA to be redeemed
 * @param acct Sending account
 * @returns Transaction ID(s)
 */
export async function redeemOnAlgorand(
  client: Algodv2,
  tokenBridgeId: bigint,
  bridgeId: bigint,
  vaa: Uint8Array,
  senderAddr: string
): Promise<TransactionSignerPair[]> {
  return await _submitVAAAlgorand(
    client,
    tokenBridgeId,
    bridgeId,
    vaa,
    senderAddr,
    BigInt(0),
  );
}
