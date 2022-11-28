/// <reference types="node" />
import { ChannelCredentials, ChannelOptions, UntypedServiceImplementation, handleServerStreamingCall, Client, CallOptions, ClientReadableStream, Metadata } from "@grpc/grpc-js";
import _m0 from "protobufjs/minimal";
import { ChainID } from "../../publicrpc/v1/publicrpc";
export declare const protobufPackage = "spy.v1";
/** A MessageFilter represents an exact match for an emitter. */
export interface EmitterFilter {
    /** Source chain */
    chainId: ChainID;
    /** Hex-encoded (without leading 0x) emitter address. */
    emitterAddress: string;
}
export interface FilterEntry {
    emitterFilter: EmitterFilter | undefined;
}
export interface SubscribeSignedVAARequest {
    /**
     * List of filters to apply to the stream (OR).
     * If empty, all messages are streamed.
     */
    filters: FilterEntry[];
}
export interface SubscribeSignedVAAResponse {
    /** Raw VAA bytes */
    vaaBytes: Buffer;
}
export declare const EmitterFilter: {
    encode(message: EmitterFilter, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): EmitterFilter;
    fromJSON(object: any): EmitterFilter;
    toJSON(message: EmitterFilter): unknown;
    fromPartial(object: DeepPartial<EmitterFilter>): EmitterFilter;
};
export declare const FilterEntry: {
    encode(message: FilterEntry, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): FilterEntry;
    fromJSON(object: any): FilterEntry;
    toJSON(message: FilterEntry): unknown;
    fromPartial(object: DeepPartial<FilterEntry>): FilterEntry;
};
export declare const SubscribeSignedVAARequest: {
    encode(message: SubscribeSignedVAARequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): SubscribeSignedVAARequest;
    fromJSON(object: any): SubscribeSignedVAARequest;
    toJSON(message: SubscribeSignedVAARequest): unknown;
    fromPartial(object: DeepPartial<SubscribeSignedVAARequest>): SubscribeSignedVAARequest;
};
export declare const SubscribeSignedVAAResponse: {
    encode(message: SubscribeSignedVAAResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): SubscribeSignedVAAResponse;
    fromJSON(object: any): SubscribeSignedVAAResponse;
    toJSON(message: SubscribeSignedVAAResponse): unknown;
    fromPartial(object: DeepPartial<SubscribeSignedVAAResponse>): SubscribeSignedVAAResponse;
};
/** SpyRPCService exposes a gossip introspection service, allowing sniffing of gossip messages. */
export declare const SpyRPCServiceService: {
    /** SubscribeSignedVAA returns a stream of signed VAA messages received on the network. */
    readonly subscribeSignedVAA: {
        readonly path: "/spy.v1.SpyRPCService/SubscribeSignedVAA";
        readonly requestStream: false;
        readonly responseStream: true;
        readonly requestSerialize: (value: SubscribeSignedVAARequest) => Buffer;
        readonly requestDeserialize: (value: Buffer) => SubscribeSignedVAARequest;
        readonly responseSerialize: (value: SubscribeSignedVAAResponse) => Buffer;
        readonly responseDeserialize: (value: Buffer) => SubscribeSignedVAAResponse;
    };
};
export interface SpyRPCServiceServer extends UntypedServiceImplementation {
    /** SubscribeSignedVAA returns a stream of signed VAA messages received on the network. */
    subscribeSignedVAA: handleServerStreamingCall<SubscribeSignedVAARequest, SubscribeSignedVAAResponse>;
}
export interface SpyRPCServiceClient extends Client {
    /** SubscribeSignedVAA returns a stream of signed VAA messages received on the network. */
    subscribeSignedVAA(request: SubscribeSignedVAARequest, options?: Partial<CallOptions>): ClientReadableStream<SubscribeSignedVAAResponse>;
    subscribeSignedVAA(request: SubscribeSignedVAARequest, metadata?: Metadata, options?: Partial<CallOptions>): ClientReadableStream<SubscribeSignedVAAResponse>;
}
export declare const SpyRPCServiceClient: new (address: string, credentials: ChannelCredentials, options?: Partial<ChannelOptions> | undefined) => SpyRPCServiceClient;
declare type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;
export declare type DeepPartial<T> = T extends Builtin ? T : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>> : T extends {} ? {
    [K in keyof T]?: DeepPartial<T[K]>;
} : Partial<T>;
export {};
