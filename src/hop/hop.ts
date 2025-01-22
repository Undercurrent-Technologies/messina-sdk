import { ethers, Overrides } from "ethers";
import { RouterImplementation__factory } from "../ethers-contracts";
import { createNonce } from "../utils";

export async function hopOnEVM(
  hopAddress: string,
  signer: ethers.Signer,
  signedVAA: Uint8Array,
  currentNetwork: string,
  nextNetwork: string,
  overrides: Overrides & { from?: string | Promise<string> } = {}
) {
  const hop = RouterImplementation__factory.connect(hopAddress, signer);
  const v = await hop.hop(
    signedVAA,
    createNonce(),
    currentNetwork,
    nextNetwork,
    overrides
  );
  const receipt = await v.wait();
  return receipt;
}

export async function getHopSequenceEVM(
  hopAddress: string,
  signer: ethers.Signer,
  vaaHash: Uint8Array,
) {
  const hop = RouterImplementation__factory.connect(hopAddress, signer);
  return await hop.getHopSequence(vaaHash);
}
