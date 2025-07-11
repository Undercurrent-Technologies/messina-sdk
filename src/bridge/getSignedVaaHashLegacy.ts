import { keccak256 } from "../utils";
import { parseVaa, SignedVaa } from "../vaa/wormhole";

export function getSignedVAAHashLegacy(signedVaa: SignedVaa): string {
  return `0x${keccak256(parseVaa(signedVaa).hash).toString("hex")}`;
}