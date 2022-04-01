"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchChunkedRequests = void 0;
var noop = function () { };
var delayForEachChunk = function (delay) { return new Promise(function (resolve) { return setTimeout(function () { return resolve(); }, delay); }); };
var ChunkDefaults;
(function (ChunkDefaults) {
    ChunkDefaults[ChunkDefaults["CHUNK_SIZE"] = 10] = "CHUNK_SIZE";
    ChunkDefaults[ChunkDefaults["CHUNK_DELAY"] = 1000] = "CHUNK_DELAY";
})(ChunkDefaults || (ChunkDefaults = {}));
var fetchChunkedRequests = function (_a) {
    var listOfPayloads = _a.listOfPayloads, _b = _a.chunkSize, chunkSize = _b === void 0 ? ChunkDefaults.CHUNK_SIZE : _b, _c = _a.chunkDelay, chunkDelay = _c === void 0 ? ChunkDefaults.CHUNK_DELAY : _c, _d = _a.fetcher, fetcher = _d === void 0 ? function () { return Promise.resolve(); } : _d, _e = _a.transformChunkends, transformChunkends = _e === void 0 ? function (chunkends) { return chunkends; } : _e, _f = _a.transformResponse, transformResponse = _f === void 0 ? function (response) { return response; } : _f, _g = _a.onChunkHasFetched, onChunkHasFetched = _g === void 0 ? noop : _g, _h = _a.onChunkedRequestsFinish, onChunkedRequestsFinish = _h === void 0 ? noop : _h;
    return __awaiter(void 0, void 0, void 0, function () {
        var payloadsFetcheds, currentChunked, chunkedsPayloads, LIMIT, fetchCurrentChunkedRequests, resolveAllRequest, fetchAllChunkedsRequests;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0:
                    payloadsFetcheds = [];
                    currentChunked = 0;
                    chunkedsPayloads = listOfPayloads.reduce(function (acc, _, index) {
                        if (index % chunkSize === 0) {
                            var chunked = listOfPayloads.slice(index, index + chunkSize);
                            return __spreadArray(__spreadArray([], acc, true), [chunked], false);
                        }
                        return acc;
                    }, []);
                    LIMIT = chunkedsPayloads.length - 1;
                    fetchCurrentChunkedRequests = function (fetchNextChunk, resolveNextChunk) { return __awaiter(void 0, void 0, void 0, function () {
                        var payloadsToFetch, response, transformedData;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    payloadsToFetch = transformChunkends(chunkedsPayloads[currentChunked]).map(fetcher);
                                    return [4 /*yield*/, Promise.all(payloadsToFetch)];
                                case 1:
                                    response = _a.sent();
                                    // If the response is not an array, it means that the API is down
                                    if (!response || response.length === 0 || !Array.isArray(response)) {
                                        return [2 /*return*/, true];
                                    }
                                    transformedData = transformResponse(response);
                                    // Delay for each chunk, this is for server timeout
                                    return [4 /*yield*/, delayForEachChunk(chunkDelay)];
                                case 2:
                                    // Delay for each chunk, this is for server timeout
                                    _a.sent();
                                    payloadsFetcheds = __spreadArray(__spreadArray([], payloadsFetcheds, true), transformedData, true);
                                    onChunkHasFetched(payloadsFetcheds);
                                    // Call next chunk
                                    if (currentChunked < LIMIT) {
                                        // If the current chunk is the last chunk, resolve the promise
                                        currentChunked++;
                                        fetchNextChunk(resolveNextChunk);
                                        return [2 /*return*/, false];
                                    }
                                    // Finish
                                    return [2 /*return*/, true];
                            }
                        });
                    }); };
                    fetchAllChunkedsRequests = function (currentResolve, initialization) {
                        if (initialization === void 0) { initialization = false; }
                        return new Promise(function (resolve) { return __awaiter(void 0, void 0, void 0, function () {
                            var hasFinish;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (initialization)
                                            resolveAllRequest = resolve;
                                        return [4 /*yield*/, fetchCurrentChunkedRequests(fetchAllChunkedsRequests, resolve)];
                                    case 1:
                                        hasFinish = _a.sent();
                                        if (hasFinish && currentResolve) {
                                            resolveAllRequest();
                                            currentResolve();
                                        }
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                    };
                    return [4 /*yield*/, fetchAllChunkedsRequests(undefined, true)];
                case 1:
                    _j.sent();
                    onChunkedRequestsFinish(payloadsFetcheds);
                    return [2 /*return*/, payloadsFetcheds];
            }
        });
    });
};
exports.fetchChunkedRequests = fetchChunkedRequests;
