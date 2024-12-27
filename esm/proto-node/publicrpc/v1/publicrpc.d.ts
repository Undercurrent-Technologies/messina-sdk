/// <reference types="node" />
import { ChannelCredentials, ChannelOptions, UntypedServiceImplementation, handleUnaryCall, Client, ClientUnaryCall, Metadata, CallOptions, ServiceError } from "@grpc/grpc-js";
import _m0 from "protobufjs/minimal";
import { Heartbeat } from "../../gossip/v1/gossip";
export declare const protobufPackage = "publicrpc.v1";
export declare enum ChainID {
    CHAIN_ID_UNSPECIFIED = 0,
    CHAIN_ID_SOLANA = 1,
    CHAIN_ID_ETHEREUM = 2,
    CHAIN_ID_TERRA = 3,
    CHAIN_ID_BSC = 4,
    CHAIN_ID_POLYGON = 5,
    CHAIN_ID_AVALANCHE = 6,
    CHAIN_ID_OASIS = 7,
    CHAIN_ID_ALGORAND = 8,
    CHAIN_ID_AURORA = 9,
    CHAIN_ID_FANTOM = 10,
    CHAIN_ID_KARURA = 11,
    CHAIN_ID_ACALA = 12,
    CHAIN_ID_KLAYTN = 13,
    CHAIN_ID_CELO = 14,
    CHAIN_ID_NEAR = 15,
    CHAIN_ID_MOONBEAM = 16,
    CHAIN_ID_NEON = 17,
    CHAIN_ID_TERRA2 = 18,
    CHAIN_ID_INJECTIVE = 19,
    CHAIN_ID_OSMOSIS = 20,
    CHAIN_ID_SUI = 21,
    CHAIN_ID_APTOS = 22,
    CHAIN_ID_ARBITRUM = 23,
    CHAIN_ID_OPTIMISM = 24,
    CHAIN_ID_GNOSIS = 25,
    CHAIN_ID_PYTHNET = 26,
    CHAIN_ID_XPLA = 28,
    CHAIN_ID_BTC = 29,
    CHAIN_ID_BASE = 30,
    CHAIN_ID_SEI = 32,
    CHAIN_ID_SEPOLIA = 10002,
    CHAIN_ID_ARBITRUM_SEPOLIA = 10003,
    CHAIN_ID_BASE_SEPOLIA = 10004,
    CHAIN_ID_OPTIMISM_SEPOLIA = 10005,
    CHAIN_ID_HOLESKY = 10006,
    CHAIN_ID_CRONOS = 20025,
    CHAIN_ID_COREDAO = 20026,
    CHAIN_ID_MANTA = 20027,
    CHAIN_ID_BAHAMUT = 20028,
    CHAIN_ID_PLUME = 20029,
    UNRECOGNIZED = -1
}
export declare function chainIDFromJSON(object: any): ChainID;
export declare function chainIDToJSON(object: ChainID): string;
/** MessageID is a VAA's globally unique identifier (see data availability design document). */
export interface MessageID {
    /** Emitter chain ID. */
    emitterChain: ChainID;
    /** Hex-encoded (without leading 0x) emitter address. */
    emitterAddress: string;
    /** Sequence number for (emitter_chain, emitter_address). */
    sequence: string;
}
export interface GetSignedVAARequest {
    messageId: MessageID | undefined;
}
export interface GetSignedVAAResponse {
    vaaBytes: Buffer;
}
export interface GetLastHeartbeatsRequest {
}
export interface GetLastHeartbeatsResponse {
    entries: GetLastHeartbeatsResponse_Entry[];
}
export interface GetLastHeartbeatsResponse_Entry {
    /**
     * Verified, hex-encoded (with leading 0x) guardian address. This is the guardian address
     * which signed this heartbeat. The GuardianAddr field inside the heartbeat
     * is NOT verified - remote nodes can put arbitrary data in it.
     */
    verifiedGuardianAddr: string;
    /**
     * Base58-encoded libp2p node address that sent this heartbeat, used to
     * distinguish between multiple nodes running for the same guardian.
     */
    p2pNodeAddr: string;
    /**
     * Raw heartbeat received from the network. Data is only as trusted
     * as the guardian node that sent it - none of the fields are verified.
     */
    rawHeartbeat: Heartbeat | undefined;
}
export interface GetCurrentGuardianSetRequest {
}
export interface GetCurrentGuardianSetResponse {
    guardianSet: GuardianSet | undefined;
}
export interface GuardianSet {
    /** Guardian set index */
    index: number;
    /** List of guardian addresses as human-readable hex-encoded (leading 0x) addresses. */
    addresses: string[];
}
export declare const MessageID: {
    encode(message: MessageID, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): MessageID;
    fromJSON(object: any): MessageID;
    toJSON(message: MessageID): unknown;
    fromPartial(object: DeepPartial<MessageID>): MessageID;
};
export declare const GetSignedVAARequest: {
    encode(message: GetSignedVAARequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): GetSignedVAARequest;
    fromJSON(object: any): GetSignedVAARequest;
    toJSON(message: GetSignedVAARequest): unknown;
    fromPartial(object: DeepPartial<GetSignedVAARequest>): GetSignedVAARequest;
};
export declare const GetSignedVAAResponse: {
    encode(message: GetSignedVAAResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): GetSignedVAAResponse;
    fromJSON(object: any): GetSignedVAAResponse;
    toJSON(message: GetSignedVAAResponse): unknown;
    fromPartial(object: DeepPartial<GetSignedVAAResponse>): GetSignedVAAResponse;
};
export declare const GetLastHeartbeatsRequest: {
    encode(_: GetLastHeartbeatsRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): GetLastHeartbeatsRequest;
    fromJSON(_: any): GetLastHeartbeatsRequest;
    toJSON(_: GetLastHeartbeatsRequest): unknown;
    fromPartial(_: DeepPartial<GetLastHeartbeatsRequest>): GetLastHeartbeatsRequest;
};
export declare const GetLastHeartbeatsResponse: {
    encode(message: GetLastHeartbeatsResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): GetLastHeartbeatsResponse;
    fromJSON(object: any): GetLastHeartbeatsResponse;
    toJSON(message: GetLastHeartbeatsResponse): unknown;
    fromPartial(object: DeepPartial<GetLastHeartbeatsResponse>): GetLastHeartbeatsResponse;
};
export declare const GetLastHeartbeatsResponse_Entry: {
    encode(message: GetLastHeartbeatsResponse_Entry, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): GetLastHeartbeatsResponse_Entry;
    fromJSON(object: any): GetLastHeartbeatsResponse_Entry;
    toJSON(message: GetLastHeartbeatsResponse_Entry): unknown;
    fromPartial(object: DeepPartial<GetLastHeartbeatsResponse_Entry>): GetLastHeartbeatsResponse_Entry;
};
export declare const GetCurrentGuardianSetRequest: {
    encode(_: GetCurrentGuardianSetRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): GetCurrentGuardianSetRequest;
    fromJSON(_: any): GetCurrentGuardianSetRequest;
    toJSON(_: GetCurrentGuardianSetRequest): unknown;
    fromPartial(_: DeepPartial<GetCurrentGuardianSetRequest>): GetCurrentGuardianSetRequest;
};
export declare const GetCurrentGuardianSetResponse: {
    encode(message: GetCurrentGuardianSetResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): GetCurrentGuardianSetResponse;
    fromJSON(object: any): GetCurrentGuardianSetResponse;
    toJSON(message: GetCurrentGuardianSetResponse): unknown;
    fromPartial(object: DeepPartial<GetCurrentGuardianSetResponse>): GetCurrentGuardianSetResponse;
};
export declare const GuardianSet: {
    encode(message: GuardianSet, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): GuardianSet;
    fromJSON(object: any): GuardianSet;
    toJSON(message: GuardianSet): unknown;
    fromPartial(object: DeepPartial<GuardianSet>): GuardianSet;
};
/** PublicRPCService service exposes endpoints to be consumed externally; GUIs, historical record keeping, etc. */
export declare const PublicRPCServiceService: {
    /**
     * GetLastHeartbeats returns the last heartbeat received for each guardian node in the
     * node's active guardian set. Heartbeats received by nodes not in the guardian set are ignored.
     * The heartbeat value is null if no heartbeat has yet been received.
     */
    readonly getLastHeartbeats: {
        readonly path: "/publicrpc.v1.PublicRPCService/GetLastHeartbeats";
        readonly requestStream: false;
        readonly responseStream: false;
        readonly requestSerialize: (value: GetLastHeartbeatsRequest) => Buffer;
        readonly requestDeserialize: (value: Buffer) => GetLastHeartbeatsRequest;
        readonly responseSerialize: (value: GetLastHeartbeatsResponse) => Buffer;
        readonly responseDeserialize: (value: Buffer) => GetLastHeartbeatsResponse;
    };
    readonly getSignedVAA: {
        readonly path: "/publicrpc.v1.PublicRPCService/GetSignedVAA";
        readonly requestStream: false;
        readonly responseStream: false;
        readonly requestSerialize: (value: GetSignedVAARequest) => Buffer;
        readonly requestDeserialize: (value: Buffer) => GetSignedVAARequest;
        readonly responseSerialize: (value: GetSignedVAAResponse) => Buffer;
        readonly responseDeserialize: (value: Buffer) => GetSignedVAAResponse;
    };
    readonly getCurrentGuardianSet: {
        readonly path: "/publicrpc.v1.PublicRPCService/GetCurrentGuardianSet";
        readonly requestStream: false;
        readonly responseStream: false;
        readonly requestSerialize: (value: GetCurrentGuardianSetRequest) => Buffer;
        readonly requestDeserialize: (value: Buffer) => GetCurrentGuardianSetRequest;
        readonly responseSerialize: (value: GetCurrentGuardianSetResponse) => Buffer;
        readonly responseDeserialize: (value: Buffer) => GetCurrentGuardianSetResponse;
    };
};
export interface PublicRPCServiceServer extends UntypedServiceImplementation {
    /**
     * GetLastHeartbeats returns the last heartbeat received for each guardian node in the
     * node's active guardian set. Heartbeats received by nodes not in the guardian set are ignored.
     * The heartbeat value is null if no heartbeat has yet been received.
     */
    getLastHeartbeats: handleUnaryCall<GetLastHeartbeatsRequest, GetLastHeartbeatsResponse>;
    getSignedVAA: handleUnaryCall<GetSignedVAARequest, GetSignedVAAResponse>;
    getCurrentGuardianSet: handleUnaryCall<GetCurrentGuardianSetRequest, GetCurrentGuardianSetResponse>;
}
export interface PublicRPCServiceClient extends Client {
    /**
     * GetLastHeartbeats returns the last heartbeat received for each guardian node in the
     * node's active guardian set. Heartbeats received by nodes not in the guardian set are ignored.
     * The heartbeat value is null if no heartbeat has yet been received.
     */
    getLastHeartbeats(request: GetLastHeartbeatsRequest, callback: (error: ServiceError | null, response: GetLastHeartbeatsResponse) => void): ClientUnaryCall;
    getLastHeartbeats(request: GetLastHeartbeatsRequest, metadata: Metadata, callback: (error: ServiceError | null, response: GetLastHeartbeatsResponse) => void): ClientUnaryCall;
    getLastHeartbeats(request: GetLastHeartbeatsRequest, metadata: Metadata, options: Partial<CallOptions>, callback: (error: ServiceError | null, response: GetLastHeartbeatsResponse) => void): ClientUnaryCall;
    getSignedVAA(request: GetSignedVAARequest, callback: (error: ServiceError | null, response: GetSignedVAAResponse) => void): ClientUnaryCall;
    getSignedVAA(request: GetSignedVAARequest, metadata: Metadata, callback: (error: ServiceError | null, response: GetSignedVAAResponse) => void): ClientUnaryCall;
    getSignedVAA(request: GetSignedVAARequest, metadata: Metadata, options: Partial<CallOptions>, callback: (error: ServiceError | null, response: GetSignedVAAResponse) => void): ClientUnaryCall;
    getCurrentGuardianSet(request: GetCurrentGuardianSetRequest, callback: (error: ServiceError | null, response: GetCurrentGuardianSetResponse) => void): ClientUnaryCall;
    getCurrentGuardianSet(request: GetCurrentGuardianSetRequest, metadata: Metadata, callback: (error: ServiceError | null, response: GetCurrentGuardianSetResponse) => void): ClientUnaryCall;
    getCurrentGuardianSet(request: GetCurrentGuardianSetRequest, metadata: Metadata, options: Partial<CallOptions>, callback: (error: ServiceError | null, response: GetCurrentGuardianSetResponse) => void): ClientUnaryCall;
}
export declare const PublicRPCServiceClient: new (address: string, credentials: ChannelCredentials, options?: Partial<ChannelOptions> | undefined) => PublicRPCServiceClient;
declare type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;
export declare type DeepPartial<T> = T extends Builtin ? T : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>> : T extends {} ? {
    [K in keyof T]?: DeepPartial<T[K]>;
} : Partial<T>;
export {};
