export type NftBridge = {
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
                    "name": "wormhole",
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
                    "name": "to",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "toAuthority",
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
                    "isMut": true,
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
                    "name": "to",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "toAuthority",
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
                    "name": "tokenProgram",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "splMetadataProgram",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "associatedTokenProgram",
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
            "name": "completeWrappedMeta",
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
                    "name": "vaa",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "endpoint",
                    "isMut": false,
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
                    "name": "tokenProgram",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "splMetadataProgram",
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
                    "name": "splMetadata",
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
                    "name": "splMetadataProgram",
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
                    "name": "targetAddress",
                    "type": {
                        "array": [
                            "u8", 32
                        ]
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
                    "name": "splMetadata",
                    "isMut": false,
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
                    "name": "splMetadataProgram",
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
                    "name": "targetAddress",
                    "type": {
                        "array": [
                            "u8", 32
                        ]
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
            "args": []
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
                    "name": "nftBridgeProgram",
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
            "args": []
        }
    ],
    "accounts": [
        
    ]
}
