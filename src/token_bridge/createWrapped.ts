import { Types } from "aptos";
import {
  createWrappedCoinType as createWrappedCoinTypeAptos,
} from "../aptos";


/**
 * Constructs payload to create wrapped asset type. The type is of form `{{address}}::coin::T`,
 * where address is `sha256_hash(tokenBridgeAddress | chainID | "::" | originAddress | 0xFF)`.
 *
 * Note that the typical createWrapped call is broken into two parts on Aptos because we must first
 * create the CoinType that is used by `create_wrapped_coin<CoinType>`. Since it's not possible to
 * create a resource and use it in the same transaction, this is broken into separate transactions.
 * @param tokenBridgeAddress Address of token bridge
 * @param attestVAA Bytes of attest VAA
 * @returns Transaction payload
 */
export function createWrappedTypeOnAptos(
  tokenBridgeAddress: string,
  attestVAA: Uint8Array
): Types.EntryFunctionPayload {
  return createWrappedCoinTypeAptos(tokenBridgeAddress, attestVAA);
}