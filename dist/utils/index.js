"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.delayForEachChunk = exports.noop = void 0;
var noop = function () { };
exports.noop = noop;
var delayForEachChunk = function (delay) { return new Promise(function (resolve) { return setTimeout(function () { return resolve(); }, delay); }); };
exports.delayForEachChunk = delayForEachChunk;
//# sourceMappingURL=index.js.map