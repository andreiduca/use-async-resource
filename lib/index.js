"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AsyncResourceContent = exports.resourceCache = exports.fileResource = exports.preloadResource = exports.useAsyncResource = void 0;
__exportStar(require("./types"), exports);
const useAsyncResource_1 = require("./useAsyncResource");
Object.defineProperty(exports, "useAsyncResource", { enumerable: true, get: function () { return useAsyncResource_1.useAsyncResource; } });
const fileResource = __importStar(require("./fileResource"));
exports.fileResource = fileResource;
const cache_1 = require("./cache");
Object.defineProperty(exports, "resourceCache", { enumerable: true, get: function () { return cache_1.resourceCache; } });
const dataReaderInitializer_1 = require("./dataReaderInitializer");
Object.defineProperty(exports, "preloadResource", { enumerable: true, get: function () { return dataReaderInitializer_1.initializeDataReader; } });
const AsyncResourceContent_1 = __importDefault(require("./AsyncResourceContent"));
exports.AsyncResourceContent = AsyncResourceContent_1.default;
//# sourceMappingURL=index.js.map