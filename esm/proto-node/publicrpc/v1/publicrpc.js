var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
/* eslint-disable */
import Long from "long";
import { makeGenericClientConstructor, } from "@grpc/grpc-js";
import _m0 from "protobufjs/minimal";
import { Heartbeat } from "../../gossip/v1/gossip";
export var protobufPackage = "publicrpc.v1";
export var ChainID;
(function (ChainID) {
    ChainID[ChainID["CHAIN_ID_UNSPECIFIED"] = 0] = "CHAIN_ID_UNSPECIFIED";
    ChainID[ChainID["CHAIN_ID_SOLANA"] = 1] = "CHAIN_ID_SOLANA";
    ChainID[ChainID["CHAIN_ID_ETHEREUM"] = 2] = "CHAIN_ID_ETHEREUM";
    ChainID[ChainID["CHAIN_ID_TERRA"] = 3] = "CHAIN_ID_TERRA";
    ChainID[ChainID["CHAIN_ID_BSC"] = 4] = "CHAIN_ID_BSC";
    ChainID[ChainID["CHAIN_ID_POLYGON"] = 5] = "CHAIN_ID_POLYGON";
    ChainID[ChainID["CHAIN_ID_AVALANCHE"] = 6] = "CHAIN_ID_AVALANCHE";
    ChainID[ChainID["CHAIN_ID_OASIS"] = 7] = "CHAIN_ID_OASIS";
    ChainID[ChainID["CHAIN_ID_ALGORAND"] = 8] = "CHAIN_ID_ALGORAND";
    ChainID[ChainID["CHAIN_ID_AURORA"] = 9] = "CHAIN_ID_AURORA";
    ChainID[ChainID["CHAIN_ID_FANTOM"] = 10] = "CHAIN_ID_FANTOM";
    ChainID[ChainID["CHAIN_ID_KARURA"] = 11] = "CHAIN_ID_KARURA";
    ChainID[ChainID["CHAIN_ID_ACALA"] = 12] = "CHAIN_ID_ACALA";
    ChainID[ChainID["CHAIN_ID_KLAYTN"] = 13] = "CHAIN_ID_KLAYTN";
    ChainID[ChainID["CHAIN_ID_CELO"] = 14] = "CHAIN_ID_CELO";
    ChainID[ChainID["CHAIN_ID_NEAR"] = 15] = "CHAIN_ID_NEAR";
    ChainID[ChainID["CHAIN_ID_MOONBEAM"] = 16] = "CHAIN_ID_MOONBEAM";
    ChainID[ChainID["CHAIN_ID_NEON"] = 17] = "CHAIN_ID_NEON";
    ChainID[ChainID["CHAIN_ID_TERRA2"] = 18] = "CHAIN_ID_TERRA2";
    ChainID[ChainID["CHAIN_ID_INJECTIVE"] = 19] = "CHAIN_ID_INJECTIVE";
    ChainID[ChainID["CHAIN_ID_OSMOSIS"] = 20] = "CHAIN_ID_OSMOSIS";
    ChainID[ChainID["CHAIN_ID_SUI"] = 21] = "CHAIN_ID_SUI";
    ChainID[ChainID["CHAIN_ID_APTOS"] = 22] = "CHAIN_ID_APTOS";
    ChainID[ChainID["CHAIN_ID_ARBITRUM"] = 23] = "CHAIN_ID_ARBITRUM";
    ChainID[ChainID["CHAIN_ID_OPTIMISM"] = 24] = "CHAIN_ID_OPTIMISM";
    ChainID[ChainID["CHAIN_ID_GNOSIS"] = 25] = "CHAIN_ID_GNOSIS";
    ChainID[ChainID["CHAIN_ID_PYTHNET"] = 26] = "CHAIN_ID_PYTHNET";
    ChainID[ChainID["CHAIN_ID_XPLA"] = 28] = "CHAIN_ID_XPLA";
    ChainID[ChainID["CHAIN_ID_BTC"] = 29] = "CHAIN_ID_BTC";
    ChainID[ChainID["CHAIN_ID_BASE"] = 30] = "CHAIN_ID_BASE";
    ChainID[ChainID["CHAIN_ID_SEI"] = 32] = "CHAIN_ID_SEI";
    ChainID[ChainID["CHAIN_ID_SEPOLIA"] = 10002] = "CHAIN_ID_SEPOLIA";
    ChainID[ChainID["CHAIN_ID_CRONOS"] = 20025] = "CHAIN_ID_CRONOS";
    ChainID[ChainID["UNRECOGNIZED"] = -1] = "UNRECOGNIZED";
})(ChainID || (ChainID = {}));
export function chainIDFromJSON(object) {
    switch (object) {
        case 0:
        case "CHAIN_ID_UNSPECIFIED":
            return ChainID.CHAIN_ID_UNSPECIFIED;
        case 1:
        case "CHAIN_ID_SOLANA":
            return ChainID.CHAIN_ID_SOLANA;
        case 2:
        case "CHAIN_ID_ETHEREUM":
            return ChainID.CHAIN_ID_ETHEREUM;
        case 3:
        case "CHAIN_ID_TERRA":
            return ChainID.CHAIN_ID_TERRA;
        case 4:
        case "CHAIN_ID_BSC":
            return ChainID.CHAIN_ID_BSC;
        case 5:
        case "CHAIN_ID_POLYGON":
            return ChainID.CHAIN_ID_POLYGON;
        case 6:
        case "CHAIN_ID_AVALANCHE":
            return ChainID.CHAIN_ID_AVALANCHE;
        case 7:
        case "CHAIN_ID_OASIS":
            return ChainID.CHAIN_ID_OASIS;
        case 8:
        case "CHAIN_ID_ALGORAND":
            return ChainID.CHAIN_ID_ALGORAND;
        case 9:
        case "CHAIN_ID_AURORA":
            return ChainID.CHAIN_ID_AURORA;
        case 10:
        case "CHAIN_ID_FANTOM":
            return ChainID.CHAIN_ID_FANTOM;
        case 11:
        case "CHAIN_ID_KARURA":
            return ChainID.CHAIN_ID_KARURA;
        case 12:
        case "CHAIN_ID_ACALA":
            return ChainID.CHAIN_ID_ACALA;
        case 13:
        case "CHAIN_ID_KLAYTN":
            return ChainID.CHAIN_ID_KLAYTN;
        case 14:
        case "CHAIN_ID_CELO":
            return ChainID.CHAIN_ID_CELO;
        case 15:
        case "CHAIN_ID_NEAR":
            return ChainID.CHAIN_ID_NEAR;
        case 16:
        case "CHAIN_ID_MOONBEAM":
            return ChainID.CHAIN_ID_MOONBEAM;
        case 17:
        case "CHAIN_ID_NEON":
            return ChainID.CHAIN_ID_NEON;
        case 18:
        case "CHAIN_ID_TERRA2":
            return ChainID.CHAIN_ID_TERRA2;
        case 19:
        case "CHAIN_ID_INJECTIVE":
            return ChainID.CHAIN_ID_INJECTIVE;
        case 20:
        case "CHAIN_ID_OSMOSIS":
            return ChainID.CHAIN_ID_OSMOSIS;
        case 21:
        case "CHAIN_ID_SUI":
            return ChainID.CHAIN_ID_SUI;
        case 22:
        case "CHAIN_ID_APTOS":
            return ChainID.CHAIN_ID_APTOS;
        case 23:
        case "CHAIN_ID_ARBITRUM":
            return ChainID.CHAIN_ID_ARBITRUM;
        case 24:
        case "CHAIN_ID_OPTIMISM":
            return ChainID.CHAIN_ID_OPTIMISM;
        case 25:
        case "CHAIN_ID_GNOSIS":
            return ChainID.CHAIN_ID_GNOSIS;
        case 26:
        case "CHAIN_ID_PYTHNET":
            return ChainID.CHAIN_ID_PYTHNET;
        case 28:
        case "CHAIN_ID_XPLA":
            return ChainID.CHAIN_ID_XPLA;
        case 29:
        case "CHAIN_ID_BTC":
            return ChainID.CHAIN_ID_BTC;
        case 30:
        case "CHAIN_ID_BASE":
            return ChainID.CHAIN_ID_BASE;
        case 32:
        case "CHAIN_ID_SEI":
            return ChainID.CHAIN_ID_SEI;
        case 10002:
        case "CHAIN_ID_SEPOLIA":
            return ChainID.CHAIN_ID_SEPOLIA;
        case 20025:
        case "CHAIN_ID_CRONOS":
            return ChainID.CHAIN_ID_CRONOS;
        case -1:
        case "UNRECOGNIZED":
        default:
            return ChainID.UNRECOGNIZED;
    }
}
export function chainIDToJSON(object) {
    switch (object) {
        case ChainID.CHAIN_ID_UNSPECIFIED:
            return "CHAIN_ID_UNSPECIFIED";
        case ChainID.CHAIN_ID_SOLANA:
            return "CHAIN_ID_SOLANA";
        case ChainID.CHAIN_ID_ETHEREUM:
            return "CHAIN_ID_ETHEREUM";
        case ChainID.CHAIN_ID_TERRA:
            return "CHAIN_ID_TERRA";
        case ChainID.CHAIN_ID_BSC:
            return "CHAIN_ID_BSC";
        case ChainID.CHAIN_ID_POLYGON:
            return "CHAIN_ID_POLYGON";
        case ChainID.CHAIN_ID_AVALANCHE:
            return "CHAIN_ID_AVALANCHE";
        case ChainID.CHAIN_ID_OASIS:
            return "CHAIN_ID_OASIS";
        case ChainID.CHAIN_ID_ALGORAND:
            return "CHAIN_ID_ALGORAND";
        case ChainID.CHAIN_ID_AURORA:
            return "CHAIN_ID_AURORA";
        case ChainID.CHAIN_ID_FANTOM:
            return "CHAIN_ID_FANTOM";
        case ChainID.CHAIN_ID_KARURA:
            return "CHAIN_ID_KARURA";
        case ChainID.CHAIN_ID_ACALA:
            return "CHAIN_ID_ACALA";
        case ChainID.CHAIN_ID_KLAYTN:
            return "CHAIN_ID_KLAYTN";
        case ChainID.CHAIN_ID_CELO:
            return "CHAIN_ID_CELO";
        case ChainID.CHAIN_ID_NEAR:
            return "CHAIN_ID_NEAR";
        case ChainID.CHAIN_ID_MOONBEAM:
            return "CHAIN_ID_MOONBEAM";
        case ChainID.CHAIN_ID_NEON:
            return "CHAIN_ID_NEON";
        case ChainID.CHAIN_ID_TERRA2:
            return "CHAIN_ID_TERRA2";
        case ChainID.CHAIN_ID_INJECTIVE:
            return "CHAIN_ID_INJECTIVE";
        case ChainID.CHAIN_ID_OSMOSIS:
            return "CHAIN_ID_OSMOSIS";
        case ChainID.CHAIN_ID_SUI:
            return "CHAIN_ID_SUI";
        case ChainID.CHAIN_ID_APTOS:
            return "CHAIN_ID_APTOS";
        case ChainID.CHAIN_ID_ARBITRUM:
            return "CHAIN_ID_ARBITRUM";
        case ChainID.CHAIN_ID_OPTIMISM:
            return "CHAIN_ID_OPTIMISM";
        case ChainID.CHAIN_ID_GNOSIS:
            return "CHAIN_ID_GNOSIS";
        case ChainID.CHAIN_ID_PYTHNET:
            return "CHAIN_ID_PYTHNET";
        case ChainID.CHAIN_ID_XPLA:
            return "CHAIN_ID_XPLA";
        case ChainID.CHAIN_ID_BTC:
            return "CHAIN_ID_BTC";
        case ChainID.CHAIN_ID_BASE:
            return "CHAIN_ID_BASE";
        case ChainID.CHAIN_ID_SEI:
            return "CHAIN_ID_SEI";
        case ChainID.CHAIN_ID_SEPOLIA:
            return "CHAIN_ID_SEPOLIA";
        case ChainID.CHAIN_ID_CRONOS:
            return "CHAIN_ID_CRONOS";    
        default:
            return "UNKNOWN";
    }
}
var baseMessageID = {
    emitterChain: 0,
    emitterAddress: "",
    sequence: "0",
};
export var MessageID = {
    encode: function (message, writer) {
        if (writer === void 0) { writer = _m0.Writer.create(); }
        if (message.emitterChain !== 0) {
            writer.uint32(8).int32(message.emitterChain);
        }
        if (message.emitterAddress !== "") {
            writer.uint32(18).string(message.emitterAddress);
        }
        if (message.sequence !== "0") {
            writer.uint32(24).uint64(message.sequence);
        }
        return writer;
    },
    decode: function (input, length) {
        var reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
        var end = length === undefined ? reader.len : reader.pos + length;
        var message = __assign({}, baseMessageID);
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.emitterChain = reader.int32();
                    break;
                case 2:
                    message.emitterAddress = reader.string();
                    break;
                case 3:
                    message.sequence = longToString(reader.uint64());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON: function (object) {
        var message = __assign({}, baseMessageID);
        if (object.emitterChain !== undefined && object.emitterChain !== null) {
            message.emitterChain = chainIDFromJSON(object.emitterChain);
        }
        else {
            message.emitterChain = 0;
        }
        if (object.emitterAddress !== undefined && object.emitterAddress !== null) {
            message.emitterAddress = String(object.emitterAddress);
        }
        else {
            message.emitterAddress = "";
        }
        if (object.sequence !== undefined && object.sequence !== null) {
            message.sequence = String(object.sequence);
        }
        else {
            message.sequence = "0";
        }
        return message;
    },
    toJSON: function (message) {
        var obj = {};
        message.emitterChain !== undefined &&
            (obj.emitterChain = chainIDToJSON(message.emitterChain));
        message.emitterAddress !== undefined &&
            (obj.emitterAddress = message.emitterAddress);
        message.sequence !== undefined && (obj.sequence = message.sequence);
        return obj;
    },
    fromPartial: function (object) {
        var message = __assign({}, baseMessageID);
        if (object.emitterChain !== undefined && object.emitterChain !== null) {
            message.emitterChain = object.emitterChain;
        }
        else {
            message.emitterChain = 0;
        }
        if (object.emitterAddress !== undefined && object.emitterAddress !== null) {
            message.emitterAddress = object.emitterAddress;
        }
        else {
            message.emitterAddress = "";
        }
        if (object.sequence !== undefined && object.sequence !== null) {
            message.sequence = object.sequence;
        }
        else {
            message.sequence = "0";
        }
        return message;
    },
};
var baseGetSignedVAARequest = {};
export var GetSignedVAARequest = {
    encode: function (message, writer) {
        if (writer === void 0) { writer = _m0.Writer.create(); }
        if (message.messageId !== undefined) {
            MessageID.encode(message.messageId, writer.uint32(10).fork()).ldelim();
        }
        return writer;
    },
    decode: function (input, length) {
        var reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
        var end = length === undefined ? reader.len : reader.pos + length;
        var message = __assign({}, baseGetSignedVAARequest);
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.messageId = MessageID.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON: function (object) {
        var message = __assign({}, baseGetSignedVAARequest);
        if (object.messageId !== undefined && object.messageId !== null) {
            message.messageId = MessageID.fromJSON(object.messageId);
        }
        else {
            message.messageId = undefined;
        }
        return message;
    },
    toJSON: function (message) {
        var obj = {};
        message.messageId !== undefined &&
            (obj.messageId = message.messageId
                ? MessageID.toJSON(message.messageId)
                : undefined);
        return obj;
    },
    fromPartial: function (object) {
        var message = __assign({}, baseGetSignedVAARequest);
        if (object.messageId !== undefined && object.messageId !== null) {
            message.messageId = MessageID.fromPartial(object.messageId);
        }
        else {
            message.messageId = undefined;
        }
        return message;
    },
};
var baseGetSignedVAAResponse = {};
export var GetSignedVAAResponse = {
    encode: function (message, writer) {
        if (writer === void 0) { writer = _m0.Writer.create(); }
        if (message.vaaBytes.length !== 0) {
            writer.uint32(10).bytes(message.vaaBytes);
        }
        return writer;
    },
    decode: function (input, length) {
        var reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
        var end = length === undefined ? reader.len : reader.pos + length;
        var message = __assign({}, baseGetSignedVAAResponse);
        message.vaaBytes = Buffer.alloc(0);
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.vaaBytes = reader.bytes();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON: function (object) {
        var message = __assign({}, baseGetSignedVAAResponse);
        message.vaaBytes = Buffer.alloc(0);
        if (object.vaaBytes !== undefined && object.vaaBytes !== null) {
            message.vaaBytes = Buffer.from(bytesFromBase64(object.vaaBytes));
        }
        return message;
    },
    toJSON: function (message) {
        var obj = {};
        message.vaaBytes !== undefined &&
            (obj.vaaBytes = base64FromBytes(message.vaaBytes !== undefined ? message.vaaBytes : Buffer.alloc(0)));
        return obj;
    },
    fromPartial: function (object) {
        var message = __assign({}, baseGetSignedVAAResponse);
        if (object.vaaBytes !== undefined && object.vaaBytes !== null) {
            message.vaaBytes = object.vaaBytes;
        }
        else {
            message.vaaBytes = Buffer.alloc(0);
        }
        return message;
    },
};
var baseGetLastHeartbeatsRequest = {};
export var GetLastHeartbeatsRequest = {
    encode: function (_, writer) {
        if (writer === void 0) { writer = _m0.Writer.create(); }
        return writer;
    },
    decode: function (input, length) {
        var reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
        var end = length === undefined ? reader.len : reader.pos + length;
        var message = __assign({}, baseGetLastHeartbeatsRequest);
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON: function (_) {
        var message = __assign({}, baseGetLastHeartbeatsRequest);
        return message;
    },
    toJSON: function (_) {
        var obj = {};
        return obj;
    },
    fromPartial: function (_) {
        var message = __assign({}, baseGetLastHeartbeatsRequest);
        return message;
    },
};
var baseGetLastHeartbeatsResponse = {};
export var GetLastHeartbeatsResponse = {
    encode: function (message, writer) {
        var e_1, _a;
        if (writer === void 0) { writer = _m0.Writer.create(); }
        try {
            for (var _b = __values(message.entries), _c = _b.next(); !_c.done; _c = _b.next()) {
                var v = _c.value;
                GetLastHeartbeatsResponse_Entry.encode(v, writer.uint32(10).fork()).ldelim();
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return writer;
    },
    decode: function (input, length) {
        var reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
        var end = length === undefined ? reader.len : reader.pos + length;
        var message = __assign({}, baseGetLastHeartbeatsResponse);
        message.entries = [];
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.entries.push(GetLastHeartbeatsResponse_Entry.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON: function (object) {
        var e_2, _a;
        var message = __assign({}, baseGetLastHeartbeatsResponse);
        message.entries = [];
        if (object.entries !== undefined && object.entries !== null) {
            try {
                for (var _b = __values(object.entries), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var e = _c.value;
                    message.entries.push(GetLastHeartbeatsResponse_Entry.fromJSON(e));
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_2) throw e_2.error; }
            }
        }
        return message;
    },
    toJSON: function (message) {
        var obj = {};
        if (message.entries) {
            obj.entries = message.entries.map(function (e) {
                return e ? GetLastHeartbeatsResponse_Entry.toJSON(e) : undefined;
            });
        }
        else {
            obj.entries = [];
        }
        return obj;
    },
    fromPartial: function (object) {
        var e_3, _a;
        var message = __assign({}, baseGetLastHeartbeatsResponse);
        message.entries = [];
        if (object.entries !== undefined && object.entries !== null) {
            try {
                for (var _b = __values(object.entries), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var e = _c.value;
                    message.entries.push(GetLastHeartbeatsResponse_Entry.fromPartial(e));
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_3) throw e_3.error; }
            }
        }
        return message;
    },
};
var baseGetLastHeartbeatsResponse_Entry = {
    verifiedGuardianAddr: "",
    p2pNodeAddr: "",
};
export var GetLastHeartbeatsResponse_Entry = {
    encode: function (message, writer) {
        if (writer === void 0) { writer = _m0.Writer.create(); }
        if (message.verifiedGuardianAddr !== "") {
            writer.uint32(10).string(message.verifiedGuardianAddr);
        }
        if (message.p2pNodeAddr !== "") {
            writer.uint32(18).string(message.p2pNodeAddr);
        }
        if (message.rawHeartbeat !== undefined) {
            Heartbeat.encode(message.rawHeartbeat, writer.uint32(26).fork()).ldelim();
        }
        return writer;
    },
    decode: function (input, length) {
        var reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
        var end = length === undefined ? reader.len : reader.pos + length;
        var message = __assign({}, baseGetLastHeartbeatsResponse_Entry);
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.verifiedGuardianAddr = reader.string();
                    break;
                case 2:
                    message.p2pNodeAddr = reader.string();
                    break;
                case 3:
                    message.rawHeartbeat = Heartbeat.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON: function (object) {
        var message = __assign({}, baseGetLastHeartbeatsResponse_Entry);
        if (object.verifiedGuardianAddr !== undefined &&
            object.verifiedGuardianAddr !== null) {
            message.verifiedGuardianAddr = String(object.verifiedGuardianAddr);
        }
        else {
            message.verifiedGuardianAddr = "";
        }
        if (object.p2pNodeAddr !== undefined && object.p2pNodeAddr !== null) {
            message.p2pNodeAddr = String(object.p2pNodeAddr);
        }
        else {
            message.p2pNodeAddr = "";
        }
        if (object.rawHeartbeat !== undefined && object.rawHeartbeat !== null) {
            message.rawHeartbeat = Heartbeat.fromJSON(object.rawHeartbeat);
        }
        else {
            message.rawHeartbeat = undefined;
        }
        return message;
    },
    toJSON: function (message) {
        var obj = {};
        message.verifiedGuardianAddr !== undefined &&
            (obj.verifiedGuardianAddr = message.verifiedGuardianAddr);
        message.p2pNodeAddr !== undefined &&
            (obj.p2pNodeAddr = message.p2pNodeAddr);
        message.rawHeartbeat !== undefined &&
            (obj.rawHeartbeat = message.rawHeartbeat
                ? Heartbeat.toJSON(message.rawHeartbeat)
                : undefined);
        return obj;
    },
    fromPartial: function (object) {
        var message = __assign({}, baseGetLastHeartbeatsResponse_Entry);
        if (object.verifiedGuardianAddr !== undefined &&
            object.verifiedGuardianAddr !== null) {
            message.verifiedGuardianAddr = object.verifiedGuardianAddr;
        }
        else {
            message.verifiedGuardianAddr = "";
        }
        if (object.p2pNodeAddr !== undefined && object.p2pNodeAddr !== null) {
            message.p2pNodeAddr = object.p2pNodeAddr;
        }
        else {
            message.p2pNodeAddr = "";
        }
        if (object.rawHeartbeat !== undefined && object.rawHeartbeat !== null) {
            message.rawHeartbeat = Heartbeat.fromPartial(object.rawHeartbeat);
        }
        else {
            message.rawHeartbeat = undefined;
        }
        return message;
    },
};
var baseGetCurrentGuardianSetRequest = {};
export var GetCurrentGuardianSetRequest = {
    encode: function (_, writer) {
        if (writer === void 0) { writer = _m0.Writer.create(); }
        return writer;
    },
    decode: function (input, length) {
        var reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
        var end = length === undefined ? reader.len : reader.pos + length;
        var message = __assign({}, baseGetCurrentGuardianSetRequest);
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON: function (_) {
        var message = __assign({}, baseGetCurrentGuardianSetRequest);
        return message;
    },
    toJSON: function (_) {
        var obj = {};
        return obj;
    },
    fromPartial: function (_) {
        var message = __assign({}, baseGetCurrentGuardianSetRequest);
        return message;
    },
};
var baseGetCurrentGuardianSetResponse = {};
export var GetCurrentGuardianSetResponse = {
    encode: function (message, writer) {
        if (writer === void 0) { writer = _m0.Writer.create(); }
        if (message.guardianSet !== undefined) {
            GuardianSet.encode(message.guardianSet, writer.uint32(10).fork()).ldelim();
        }
        return writer;
    },
    decode: function (input, length) {
        var reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
        var end = length === undefined ? reader.len : reader.pos + length;
        var message = __assign({}, baseGetCurrentGuardianSetResponse);
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.guardianSet = GuardianSet.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON: function (object) {
        var message = __assign({}, baseGetCurrentGuardianSetResponse);
        if (object.guardianSet !== undefined && object.guardianSet !== null) {
            message.guardianSet = GuardianSet.fromJSON(object.guardianSet);
        }
        else {
            message.guardianSet = undefined;
        }
        return message;
    },
    toJSON: function (message) {
        var obj = {};
        message.guardianSet !== undefined &&
            (obj.guardianSet = message.guardianSet
                ? GuardianSet.toJSON(message.guardianSet)
                : undefined);
        return obj;
    },
    fromPartial: function (object) {
        var message = __assign({}, baseGetCurrentGuardianSetResponse);
        if (object.guardianSet !== undefined && object.guardianSet !== null) {
            message.guardianSet = GuardianSet.fromPartial(object.guardianSet);
        }
        else {
            message.guardianSet = undefined;
        }
        return message;
    },
};
var baseGuardianSet = { index: 0, addresses: "" };
export var GuardianSet = {
    encode: function (message, writer) {
        var e_4, _a;
        if (writer === void 0) { writer = _m0.Writer.create(); }
        if (message.index !== 0) {
            writer.uint32(8).uint32(message.index);
        }
        try {
            for (var _b = __values(message.addresses), _c = _b.next(); !_c.done; _c = _b.next()) {
                var v = _c.value;
                writer.uint32(18).string(v);
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_4) throw e_4.error; }
        }
        return writer;
    },
    decode: function (input, length) {
        var reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
        var end = length === undefined ? reader.len : reader.pos + length;
        var message = __assign({}, baseGuardianSet);
        message.addresses = [];
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.index = reader.uint32();
                    break;
                case 2:
                    message.addresses.push(reader.string());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON: function (object) {
        var e_5, _a;
        var message = __assign({}, baseGuardianSet);
        message.addresses = [];
        if (object.index !== undefined && object.index !== null) {
            message.index = Number(object.index);
        }
        else {
            message.index = 0;
        }
        if (object.addresses !== undefined && object.addresses !== null) {
            try {
                for (var _b = __values(object.addresses), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var e = _c.value;
                    message.addresses.push(String(e));
                }
            }
            catch (e_5_1) { e_5 = { error: e_5_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_5) throw e_5.error; }
            }
        }
        return message;
    },
    toJSON: function (message) {
        var obj = {};
        message.index !== undefined && (obj.index = message.index);
        if (message.addresses) {
            obj.addresses = message.addresses.map(function (e) { return e; });
        }
        else {
            obj.addresses = [];
        }
        return obj;
    },
    fromPartial: function (object) {
        var e_6, _a;
        var message = __assign({}, baseGuardianSet);
        message.addresses = [];
        if (object.index !== undefined && object.index !== null) {
            message.index = object.index;
        }
        else {
            message.index = 0;
        }
        if (object.addresses !== undefined && object.addresses !== null) {
            try {
                for (var _b = __values(object.addresses), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var e = _c.value;
                    message.addresses.push(e);
                }
            }
            catch (e_6_1) { e_6 = { error: e_6_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_6) throw e_6.error; }
            }
        }
        return message;
    },
};
/** PublicRPCService service exposes endpoints to be consumed externally; GUIs, historical record keeping, etc. */
export var PublicRPCServiceService = {
    /**
     * GetLastHeartbeats returns the last heartbeat received for each guardian node in the
     * node's active guardian set. Heartbeats received by nodes not in the guardian set are ignored.
     * The heartbeat value is null if no heartbeat has yet been received.
     */
    getLastHeartbeats: {
        path: "/publicrpc.v1.PublicRPCService/GetLastHeartbeats",
        requestStream: false,
        responseStream: false,
        requestSerialize: function (value) {
            return Buffer.from(GetLastHeartbeatsRequest.encode(value).finish());
        },
        requestDeserialize: function (value) {
            return GetLastHeartbeatsRequest.decode(value);
        },
        responseSerialize: function (value) {
            return Buffer.from(GetLastHeartbeatsResponse.encode(value).finish());
        },
        responseDeserialize: function (value) {
            return GetLastHeartbeatsResponse.decode(value);
        },
    },
    getSignedVAA: {
        path: "/publicrpc.v1.PublicRPCService/GetSignedVAA",
        requestStream: false,
        responseStream: false,
        requestSerialize: function (value) {
            return Buffer.from(GetSignedVAARequest.encode(value).finish());
        },
        requestDeserialize: function (value) { return GetSignedVAARequest.decode(value); },
        responseSerialize: function (value) {
            return Buffer.from(GetSignedVAAResponse.encode(value).finish());
        },
        responseDeserialize: function (value) { return GetSignedVAAResponse.decode(value); },
    },
    getCurrentGuardianSet: {
        path: "/publicrpc.v1.PublicRPCService/GetCurrentGuardianSet",
        requestStream: false,
        responseStream: false,
        requestSerialize: function (value) {
            return Buffer.from(GetCurrentGuardianSetRequest.encode(value).finish());
        },
        requestDeserialize: function (value) {
            return GetCurrentGuardianSetRequest.decode(value);
        },
        responseSerialize: function (value) {
            return Buffer.from(GetCurrentGuardianSetResponse.encode(value).finish());
        },
        responseDeserialize: function (value) {
            return GetCurrentGuardianSetResponse.decode(value);
        },
    },
};
export var PublicRPCServiceClient = makeGenericClientConstructor(PublicRPCServiceService, "publicrpc.v1.PublicRPCService");
var globalThis = (function () {
    if (typeof globalThis !== "undefined")
        return globalThis;
    if (typeof self !== "undefined")
        return self;
    if (typeof window !== "undefined")
        return window;
    if (typeof global !== "undefined")
        return global;
    throw "Unable to locate global object";
})();
var atob = globalThis.atob ||
    (function (b64) { return globalThis.Buffer.from(b64, "base64").toString("binary"); });
function bytesFromBase64(b64) {
    var bin = atob(b64);
    var arr = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; ++i) {
        arr[i] = bin.charCodeAt(i);
    }
    return arr;
}
var btoa = globalThis.btoa ||
    (function (bin) { return globalThis.Buffer.from(bin, "binary").toString("base64"); });
function base64FromBytes(arr) {
    var e_7, _a;
    var bin = [];
    try {
        for (var arr_1 = __values(arr), arr_1_1 = arr_1.next(); !arr_1_1.done; arr_1_1 = arr_1.next()) {
            var byte = arr_1_1.value;
            bin.push(String.fromCharCode(byte));
        }
    }
    catch (e_7_1) { e_7 = { error: e_7_1 }; }
    finally {
        try {
            if (arr_1_1 && !arr_1_1.done && (_a = arr_1.return)) _a.call(arr_1);
        }
        finally { if (e_7) throw e_7.error; }
    }
    return btoa(bin.join(""));
}
function longToString(long) {
    return long.toString();
}
if (_m0.util.Long !== Long) {
    _m0.util.Long = Long;
    _m0.configure();
}
