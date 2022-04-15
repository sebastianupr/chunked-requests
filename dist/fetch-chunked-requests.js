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
var utils_1 = require("./utils");
var DEFAULT_CHUNK_SIZE = 10;
var DEFAULT_CHUNK_DELAY = 1000;
var fetchChunkedRequests = function (_a) {
    var listOfPayloads = _a.listOfPayloads, _b = _a.chunkSize, chunkSize = _b === void 0 ? DEFAULT_CHUNK_SIZE : _b, _c = _a.chunkDelay, chunkDelay = _c === void 0 ? DEFAULT_CHUNK_DELAY : _c, fetcher = _a.fetcher, transformChunkends = _a.transformChunkends, transformResponse = _a.transformResponse, _d = _a.onChunkHasFetched, onChunkHasFetched = _d === void 0 ? utils_1.noop : _d, _e = _a.onChunkedRequestsFinish, onChunkedRequestsFinish = _e === void 0 ? utils_1.noop : _e;
    return __awaiter(void 0, void 0, void 0, function () {
        var payloadsFetcheds, currentChunked, chunkedsPayloads, LIMIT, fetchCurrentChunkedRequests, resolveAllRequest, fetchAllChunkedsRequests;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    payloadsFetcheds = [];
                    currentChunked = 0;
                    chunkedsPayloads = listOfPayloads.reduce(function (acc, _, index) {
                        if (index % chunkSize === 0) {
                            var chunked = listOfPayloads.slice(index, index + chunkSize);
                            return __spreadArray(__spreadArray([], acc, true), [chunked], false);
                        }
                        return __spreadArray([], acc, true);
                    }, []);
                    LIMIT = chunkedsPayloads.length - 1;
                    fetchCurrentChunkedRequests = function (fetchNextChunk, resolveNextChunk) { return __awaiter(void 0, void 0, void 0, function () {
                        var transformedChunkends, payloadsToFetch, response, transformedData;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    transformedChunkends = typeof transformChunkends === 'function'
                                        ? transformChunkends(chunkedsPayloads[currentChunked])
                                        : chunkedsPayloads[currentChunked];
                                    payloadsToFetch = transformedChunkends.map(function (current) {
                                        if (typeof fetcher !== 'function') {
                                            throw new Error('Fetcher is not defined');
                                        }
                                        if (typeof current === 'undefined') {
                                            throw new Error('Current chunked is not defined');
                                        }
                                        return fetcher(current);
                                    });
                                    return [4 /*yield*/, Promise.all(payloadsToFetch)
                                        // If the response is not an array, it means that the API is down
                                    ];
                                case 1:
                                    response = _a.sent();
                                    // If the response is not an array, it means that the API is down
                                    if (!response || !Array.isArray(response)) {
                                        throw new Error('The response is not an array, check your fetcher function and try again');
                                    }
                                    transformedData = typeof transformResponse === 'function'
                                        ? transformResponse(response)
                                        : response;
                                    // Delay for each chunk, this is for server timeout
                                    return [4 /*yield*/, (0, utils_1.delayForEachChunk)(chunkDelay)];
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
                        // eslint-disable-next-line no-async-promise-executor
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
                    _f.sent();
                    onChunkedRequestsFinish(payloadsFetcheds);
                    return [2 /*return*/, payloadsFetcheds];
            }
        });
    });
};
exports.default = fetchChunkedRequests;
//# sourceMappingURL=fetch-chunked-requests.js.map