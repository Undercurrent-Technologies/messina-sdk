import { AptosClient, TxnBuilderTypes, Types } from "aptos";
import { _parseVAAAlgorand } from "../../algorand";
import {
  assertChain,
  ChainId,
  ChainName,
  CHAIN_ID_APTOS,
  coalesceChainId,
  getAssetFullyQualifiedType,
  getTypeFromExternalAddress,
  hexToUint8Array,
  isValidAptosType,
} from "../../utils";

// Attest token

export const attestToken = (
  tokenBridgeAddress: string,
  tokenChain: ChainId | ChainName,
  tokenAddress: string,
  transferFee: string,
  redeemFee: string,
  min: string,
  max: string,
  src: boolean,
  dest: boolean,
): Types.EntryFunctionPayload => {
  if (!tokenBridgeAddress) throw new Error("Need token bridge address.");
  const assetType = getAssetFullyQualifiedType(
    tokenBridgeAddress,
    coalesceChainId(tokenChain),
    tokenAddress
  );
  if (!assetType) throw new Error("Invalid asset address.");

  return {
    function: `${tokenBridgeAddress}::attest_token::attest_token_entry`,
    type_arguments: [assetType],
    arguments: [
      tokenBridgeAddress,
      transferFee,
      redeemFee,
      min,
      max,
      src,
      dest,
    ],
  };
};

// Complete transfer

export const completeTransfer = async (
  client: AptosClient,
  tokenBridgeAddress: string,
  transferVAA: Uint8Array,
  feeRecipient: string
): Promise<Types.EntryFunctionPayload> => {
  if (!tokenBridgeAddress) throw new Error("Need token bridge address.");

  const parsedVAA = _parseVAAAlgorand(transferVAA);
  if (!parsedVAA.get("FromChain") || !parsedVAA.get("Contract") || !parsedVAA.get("ToChain")) {
    throw new Error("VAA does not contain required information");
  }

  if (parsedVAA.get("ToChain") !== CHAIN_ID_APTOS) {
    throw new Error("Transfer is not destined for Aptos");
  }

  assertChain(parsedVAA.get("FromChain"));
  const assetType =
    parsedVAA.get("FromChain") === CHAIN_ID_APTOS
      ? await getTypeFromExternalAddress(
          client,
          tokenBridgeAddress,
          parsedVAA.get("Contract")
        )
      : getAssetFullyQualifiedType(
          tokenBridgeAddress,
          coalesceChainId(parsedVAA.get("FromChain")),
          parsedVAA.get("Contract")
        );
  if (!assetType) throw new Error("Invalid asset address.");

  return {
    function: `${tokenBridgeAddress}::complete_transfer::submit_vaa_entry`,
    type_arguments: [assetType],
    arguments: [transferVAA, feeRecipient],
  };
};

export const completeTransferAndRegister = async (
  client: AptosClient,
  tokenBridgeAddress: string,
  transferVAA: Uint8Array,
  tokenType: string,
): Promise<Types.EntryFunctionPayload> => {
  if (!tokenBridgeAddress) throw new Error("Need token bridge address.");

  const parsedVAA = _parseVAAAlgorand(transferVAA);
  if (!parsedVAA.get("FromChain") || !parsedVAA.get("Contract") || !parsedVAA.get("ToChain")) {
    throw new Error("VAA does not contain required information");
  }

  if (parsedVAA.get("ToChain") !== CHAIN_ID_APTOS) {
    throw new Error("Transfer is not destined for Aptos");
  }

  assertChain(parsedVAA.get("FromChain"));
  const assetType = tokenType;
    // parsedVAA.get("FromChain") === CHAIN_ID_APTOS
    //   ? await getTypeFromExternalAddress(
    //       client,
    //       tokenBridgeAddress,
    //       parsedVAA.get("Contract")
    //     )
    //   : tokenType;
  if (!assetType) throw new Error("Invalid asset address.");

  return {
    function: `${tokenBridgeAddress}::complete_transfer::submit_vaa_and_register_entry`,
    type_arguments: [assetType],
    arguments: [transferVAA],
  };
};

export const completeTransferWithPayload = (
  _tokenBridgeAddress: string,
  _tokenChain: ChainId | ChainName,
  _tokenAddress: string,
  _vaa: Uint8Array
): Types.EntryFunctionPayload => {
  throw new Error(
    "Completing transfers with payload is not yet supported in the sdk"
  );
};

/**
 * Construct a payload for a transaction that registers a coin defined by the given origin chain
 * ID and address to the sender's account.
 *
 * The bytecode was compiled from the following Move code:
 * ```move
 * script {
 *   use aptos_framework::coin;
 *   use aptos_framework::signer;
 *
 *   fun main<CoinType>(user: &signer) {
 *     if (!coin::is_account_registered<CoinType>(signer::address_of(user))) {
 *       coin::register<CoinType>(user);
 *     };
 *   }
 * }
 * ```
 * @param tokenBridgeAddress Address of token bridge
 * @param originChain Origin chain ID of asset
 * @param originAddress Asset address on origin chain
 * @returns Transaction payload
 */
export const registerCoin = (
  tokenBridgeAddress: string,
  originChain: ChainId | ChainName,
  originAddress: string
): TxnBuilderTypes.TransactionPayloadScript => {
  const bytecode = hexToUint8Array(
    "a11ceb0b050000000601000403041104150405190b072436085a200000000101020002000003020401000004000101000103020301060c000105010900010104636f696e067369676e65720a616464726573735f6f661569735f6163636f756e745f726567697374657265640872656769737465720000000000000000000000000000000000000000000000000000000000000001010000010c0a001100380020030605090b003801050b0b000102"
  );
  const assetType = getAssetFullyQualifiedType(
    tokenBridgeAddress,
    coalesceChainId(originChain),
    originAddress
  );
  if (!assetType) throw new Error("Asset type is null");
  const typeTag = new TxnBuilderTypes.TypeTagStruct(
    TxnBuilderTypes.StructTag.fromString(assetType)
  );

  return new TxnBuilderTypes.TransactionPayloadScript(
    new TxnBuilderTypes.Script(bytecode, [typeTag], [])
  );
};

// Deploy coin

// don't need `signer` and `&signer` in argument list because the Move VM will inject them
export const deployCoin = (
  tokenBridgeAddress: string
): Types.EntryFunctionPayload => {
  if (!tokenBridgeAddress) throw new Error("Need token bridge address.");
  return {
    function: `${tokenBridgeAddress}::deploy_coin::deploy_coin`,
    type_arguments: [],
    arguments: [],
  };
};

// Register chain

export const registerChain = (
  tokenBridgeAddress: string,
  chainid: ChainId,
  emitterAddress: string
): Types.EntryFunctionPayload => {
  if (!tokenBridgeAddress) throw new Error("Need token bridge address.");
  return {
    function: `${tokenBridgeAddress}::register_chain::register_chain`,
    type_arguments: [],
    arguments: [chainid, emitterAddress],
  };
};

// Transfer tokens

export const transferTokens = (
  tokenBridgeAddress: string,
  fullyQualifiedType: string,
  amount: string,
  recipientChain: ChainId | ChainName,
  recipient: Uint8Array,
  relayerFee: string,
  nonce: number
): Types.EntryFunctionPayload => {
  if (!tokenBridgeAddress) throw new Error("Need token bridge address.");
  if (!isValidAptosType(fullyQualifiedType)) {
    throw new Error("Invalid qualified type");
  }

  const recipientChainId = coalesceChainId(recipientChain);
  return {
    function: `${tokenBridgeAddress}::transfer_tokens::transfer_tokens_entry`,
    type_arguments: [fullyQualifiedType],
    arguments: [amount, recipientChainId, recipient, relayerFee, nonce],
  };
};

export const transferTokensWithPayload = (
  tokenBridgeAddress: string,
  fullyQualifiedType: string,
  amount: string,
  recipientChain: ChainId | ChainName,
  recipient: Uint8Array,
  nonce: number,
  payload: Uint8Array
): Types.EntryFunctionPayload => {
  if (!tokenBridgeAddress) throw new Error("Need token bridge address.");
  if (!isValidAptosType(fullyQualifiedType)) {
    throw new Error("Invalid qualified type");
  }
  const recipientChainId = coalesceChainId(recipientChain);
  return {
    function: `${tokenBridgeAddress}::transfer_tokens::transfer_tokens_with_payload_entry`,
    type_arguments: [fullyQualifiedType],
    arguments: [amount, recipientChainId, recipient, nonce, payload],
  };
};

// Created wrapped coin

export const createWrappedCoinType = (
  tokenBridgeAddress: string,
  vaa: Uint8Array
): Types.EntryFunctionPayload => {
  if (!tokenBridgeAddress) throw new Error("Need token bridge address.");
  return {
    function: `${tokenBridgeAddress}::wrapped::create_wrapped_coin_type`,
    type_arguments: [],
    arguments: [vaa],
  };
};

export const createWrappedCoin = (
  tokenBridgeAddress: string,
  attestVAA: Uint8Array
): Types.EntryFunctionPayload => {
  if (!tokenBridgeAddress) throw new Error("Need token bridge address.");

  const parsedVAA = _parseVAAAlgorand(attestVAA);
  if (!parsedVAA.get("FromChain") || !parsedVAA.get("Contract")) {
    throw new Error("VAA does not contain required information");
  }

  assertChain(parsedVAA.get("FromChain"));
  const assetType = getAssetFullyQualifiedType(
    tokenBridgeAddress,
    coalesceChainId(parsedVAA.get("FromChain")),
    parsedVAA.get("Contract")
  );
  if (!assetType) throw new Error("Invalid asset address.");

  return {
    function: `${tokenBridgeAddress}::wrapped::create_wrapped_coin`,
    type_arguments: [assetType],
    arguments: [attestVAA],
  };
};

export const attestTo = (
  tokenBridgeAddress: string,
  coinType: string,
  attestVaa: Uint8Array,
  transferFee: string,
  redeemFee: string,
  min: string,
  max: string,
  src: boolean,
  dest: boolean,
): Types.EntryFunctionPayload => {
  if (!tokenBridgeAddress) throw new Error("Need token bridge address.");
  return {
    function: `${tokenBridgeAddress}::attest_token::receive_attest_token_entry`,
    type_arguments: [coinType],
    arguments: [
      attestVaa,
      transferFee,
      redeemFee,
      min,
      max,
      src,
      dest,
    ],
  };
}

export const updateAdminTokenBridge = (
  tokenBridgeAddress: string,
  adminAddress: string
): Types.EntryFunctionPayload => {
  if (!tokenBridgeAddress) throw new Error("Need token bridge address.");
  return {
    function: `${tokenBridgeAddress}::token_bridge::update_admin_token_bridge`,
    type_arguments: [],
    arguments: [adminAddress],
  };
};

export const updateEscrowBridgeAddress = (
  tokenBridgeAddress: string,
  seed: string
): Types.EntryFunctionPayload => {
  if (!tokenBridgeAddress) throw new Error("Need token bridge address.");
  return {
    function: `${tokenBridgeAddress}::escrow::update_escrow_cap`,
    type_arguments: [],
    arguments: [seed],
  };
};

export const updateEscrowWhitelist = (
  tokenBridgeAddress: string,
  isFirst: boolean,
  escrowAddress: string
): Types.EntryFunctionPayload => {
  if (!tokenBridgeAddress) throw new Error("Need token bridge address.");
  return {
    function: `${tokenBridgeAddress}::token_bridge::update_escrow_whitelist`,
    type_arguments: [],
    arguments: [isFirst, escrowAddress],
  };
};

export const updateTreasuryAddress = (
  tokenBridgeAddress: string,
  address: string
): Types.EntryFunctionPayload => {
  if (!tokenBridgeAddress) throw new Error("Need token bridge address.");
  return {
    function: `${tokenBridgeAddress}::state::update_treasury_token_bridge`,
    type_arguments: [],
    arguments: [address],
  };
};

export const getEscrowAddress = (
  tokenBridgeAddress: string,
): Types.EntryFunctionPayload => {
  if (!tokenBridgeAddress) throw new Error("Need token bridge address.");
  return {
    function: `${tokenBridgeAddress}::escrow::get_escrow_address`,
    type_arguments: [],
    arguments: [],
  };
};

export const getWhitelist = (
  tokenBridgeAddress: string,
): Types.EntryFunctionPayload => {
  if (!tokenBridgeAddress) throw new Error("Need token bridge address.");
  return {
    function: `${tokenBridgeAddress}::escrow::get_whitelist`,
    type_arguments: [],
    arguments: [],
  };
};

export const getTokenConfig = (
  tokenBridgeAddress: string,
  coinType: string,
): Types.EntryFunctionPayload => {
  if (!tokenBridgeAddress) throw new Error("Need token bridge address.");
  return {
    function: `${tokenBridgeAddress}::escrow::get_token_config`,
    type_arguments: [coinType],
    arguments: [],
  };
};

export const deposit = (
  tokenBridgeAddress: string,
  coinType: string,
  amount: string,
): Types.EntryFunctionPayload => {
  if (!tokenBridgeAddress) throw new Error("Need token bridge address.");
  return {
    function: `${tokenBridgeAddress}::escrow::deposit`,
    type_arguments: [coinType],
    arguments: [amount],
  };
};

export const withdraw = (
  tokenBridgeAddress: string,
  coinType: string,
  amount: string,
  receiver: string,
): Types.EntryFunctionPayload => {
  if (!tokenBridgeAddress) throw new Error("Need token bridge address.");
  return {
    function: `${tokenBridgeAddress}::escrow::withdraw`,
    type_arguments: [coinType],
    arguments: [receiver, amount],
  };
};

export const pause = (
  tokenBridgeAddress: string,
): Types.EntryFunctionPayload => {
  if (!tokenBridgeAddress) throw new Error("Need token bridge address.");
  return {
    function: `${tokenBridgeAddress}::token_bridge::pause`,
    type_arguments: [],
    arguments: [],
  };
};

export const unpause = (
  tokenBridgeAddress: string,
): Types.EntryFunctionPayload => {
  if (!tokenBridgeAddress) throw new Error("Need token bridge address.");
  return {
    function: `${tokenBridgeAddress}::token_bridge::resume`,
    type_arguments: [],
    arguments: [],
  };
};

export const setTokenConfig = (
  tokenBridgeAddress: string,
  coinType: string,
  transferFee: string,
  redeemFee: string,
  min: string,
  max: string,
  src: boolean,
  dest: boolean,
): Types.EntryFunctionPayload => {
  if (!tokenBridgeAddress) throw new Error("Need token bridge address.");
  return {
    function: `${tokenBridgeAddress}::escrow::set_token_config`,
    type_arguments: [coinType],
    arguments: [transferFee, redeemFee, min, max, src, dest],
  };
};
