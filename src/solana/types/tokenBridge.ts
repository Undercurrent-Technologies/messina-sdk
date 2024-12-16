export type TokenBridge = {
  "version": "0.1.0",
  "name": "wormhole",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "config",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "bridge",
          "type": "publicKey"
        },
        {
          "name": "treasury",
          "type": "publicKey"
        },
        {
          "name": "admin",
          "type": "publicKey"
        },
        {
          "name": "owner",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "attestToken",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "config",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenConfig",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "wrappedMeta",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "splMetadata",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "wormholeBridge",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "wormholeMessage",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "wormholeEmitter",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "wormholeSequence",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "wormholeFeeCollector",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "clock",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "wormholeProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "nonce",
          "type": "u32"
        },
        {
          "name": "escrowAddress",
          "type": "publicKey"
        },
        {
          "name": "transferFee",
          "type": "u64"
        },
        {
          "name": "redeemFee",
          "type": "u64"
        },
        {
          "name": "min",
          "type": "u64"
        },
        {
          "name": "max",
          "type": "u64"
        },
        {
          "name": "src",
          "type": "bool"
        },
        {
          "name": "dst",
          "type": "bool"
        },
        {
          "name": "w1",
          "type": "publicKey"
        },
        {
          "name": "w2",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "completeNative",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "config",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenConfig",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "vaa",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "claim",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "endpoint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "treasuryToken",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "to",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "toFees",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "custody",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "custodySigner",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "wormholeProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "completeWrapped",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "config",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenConfig",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "vaa",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "claim",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "endpoint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "treasuryToken",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "to",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "toFees",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "custody",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "wrappedMeta",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "mintAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "custodySigner",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "wormholeProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "transferWrapped",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "config",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenConfig",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "from",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "fromOwner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "mint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "wrappedMeta",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "custody",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "treasury",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "treasuryToken",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authoritySigner",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "custodySigner",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "wormholeBridge",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "wormholeMessage",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "wormholeEmitter",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "wormholeSequence",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "wormholeFeeCollector",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "clock",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "wormholeProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "nonce",
          "type": "u32"
        },
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "fee",
          "type": "u64"
        },
        {
          "name": "targetAddress",
          "type": {
            "array": ["u8", 32]
          }
        },
        {
          "name": "targetChain",
          "type": "u16"
        }
      ]
    },
    {
      "name": "transferNative",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "config",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenConfig",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "from",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "custody",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "treasury",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "treasuryToken",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authoritySigner",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "custodySigner",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "wormholeBridge",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "wormholeMessage",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "wormholeEmitter",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "wormholeSequence",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "wormholeFeeCollector",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "clock",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "wormholeProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "nonce",
          "type": "u32"
        },
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "fee",
          "type": "u64"
        },
        {
          "name": "targetAddress",
          "type": {
            "array": ["u8", 32]
          }
        },
        {
          "name": "targetChain",
          "type": "u16"
        }
      ]
    },
    {
      "name": "registerChain",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "config",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "endpoint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "wormholeProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "foreignChainId",
          "type": "u16"
        },
        {
          "name": "endpointAddress",
          "type": "publickey"
        },
        {
          "name": "emitterAddress",
          "type": {
            "array": ["u8", 32]
          }
        }
      ]
    },
    {
      "name": "createWrapped",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "config",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenConfig",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "endpoint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "vaa",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "claim",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "wrappedMeta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "splMetadata",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mintAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "wormholeProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "splMetadataProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "escrowAddress",
          "type": "publicKey"
        },
        {
          "name": "transferFee",
          "type": "u64"
        },
        {
          "name": "redeemFee",
          "type": "u64"
        },
        {
          "name": "min",
          "type": "u64"
        },
        {
          "name": "max",
          "type": "u64"
        },
        {
          "name": "src",
          "type": "bool"
        },
        {
          "name": "dst",
          "type": "bool"
        },
        {
          "name": "w1",
          "type": "publicKey"
        },
        {
          "name": "w2",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "upgradeContract",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "upgradeAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "spill",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "implementation",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "programData",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenBridgeProgram",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "clock",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "bpfLoaderUpgradeable",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "newContract",
          "type": "publickey"
        }
      ]
    },
    {
      "name": "transferWrappedWithPayload",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "config",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "from",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "fromOwner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "mint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "wrappedMeta",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "authoritySigner",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "wormholeBridge",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "wormholeMessage",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "wormholeEmitter",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "wormholeSequence",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "wormholeFeeCollector",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "clock",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "sender",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "wormholeProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "nonce",
          "type": "u32"
        },
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "targetAddress",
          "type": {
            "array": ["u8", 32]
          }
        },
        {
          "name": "targetChain",
          "type": "u16"
        },
        {
          "name": "payload",
          "type": "bytes"
        },
        {
          "name": "cpiProgramId",
          "type": {
            "option": "publicKey"
          }
        }
      ]
    },
    {
      "name": "transferNativeWithPayload",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "config",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenConfig",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "from",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "custody",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authoritySigner",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "custodySigner",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "wormholeBridge",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "wormholeMessage",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "wormholeEmitter",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "wormholeSequence",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "wormholeFeeCollector",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "clock",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "sender",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "wormholeProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "nonce",
          "type": "u32"
        },
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "targetAddress",
          "type": {
            "array": ["u8", 32]
          }
        },
        {
          "name": "targetChain",
          "type": "u16"
        },
        {
          "name": "payload",
          "type": "bytes"
        },
        {
          "name": "cpiProgramId",
          "type": {
            "option": "publicKey"
          }
        }
      ]
    },
    {
      "name": "updateTreasuryAddress",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "config",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "treasuryAddress",
          "type": "pubkey"
        }
      ]
    },
    {
      "name": "updateWhitelistedAddresses",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "config",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenConfig",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "whitelistAddress1",
          "type": "pubkey"
        },
        {
          "name": "whitelistAddress2",
          "type": "pubkey"
        }
      ]
    },
    {
      "name": "updateAdminAddress",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "config",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "adminAddress",
          "type": "pubkey"
        }
      ]
    },
    {
      "name": "setPauseStatus",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "config",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "isPaused",
          "type": "bool"
        }
      ]
    },
    {
      "name": "deposit",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "config",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenConfig",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "from",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "custodyKey",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "custodySigner",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "splTokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "withdraw",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "config",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenConfig",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "to",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "custodyKey",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "custodySigner",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "splTokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "updateWrapped",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "config",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenConfig",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "endpoint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "vaa",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "claim",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "wrappedMeta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "splMetadata",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mintAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "wormholeProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "splMetadataProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "escrowAddress",
          "type": "publicKey"
        },
        {
          "name": "transferFee",
          "type": "u64"
        },
        {
          "name": "redeemFee",
          "type": "u64"
        },
        {
          "name": "min",
          "type": "u64"
        },
        {
          "name": "max",
          "type": "u64"
        },
        {
          "name": "src",
          "type": "bool"
        },
        {
          "name": "dst",
          "type": "bool"
        },
        {
          "name": "w1",
          "type": "publicKey"
        },
        {
          "name": "w2",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "updateTokenConfig",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "config",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenConfig",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "escrowAddress",
          "type": "publicKey"
        },
        {
          "name": "transferFee",
          "type": "u64"
        },
        {
          "name": "redeemFee",
          "type": "u64"
        },
        {
          "name": "min",
          "type": "u64"
        },
        {
          "name": "max",
          "type": "u64"
        },
        {
          "name": "src",
          "type": "bool"
        },
        {
          "name": "dst",
          "type": "bool"
        },
        {
          "name": "w1",
          "type": "publicKey"
        },
        {
          "name": "w2",
          "type": "publicKey"
        }
      ]
    }
  ],
  "accounts": [],
  "types": [
    {
      "name": "TokenConfig",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "escrowAddress",
            "type": "publicKey"
          },
          {
            "name": "transferFee",
            "type": "u64"
          },
          {
            "name": "redeemFee",
            "type": "u64"
          },
          {
            "name": "min",
            "type": "u64"
          },
          {
            "name": "max",
            "type": "u64"
          },
          {
            "name": "src",
            "type": "bool"
          },
          {
            "name": "dst",
            "type": "bool"
          },
          {
            "name": "w1",
            "type": "publicKey"
          },
          {
            "name": "w2",
            "type": "publicKey"
          }
        ]
      }
    }
  ]
}
