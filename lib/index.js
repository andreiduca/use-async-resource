"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const useAsyncResource_1 = require("./useAsyncResource");
exports.useAsyncResource = useAsyncResource_1.useAsyncResource;
const fileResource = __importStar(require("./fileResource"));
exports.fileResource = fileResource;
const cache_1 = require("./cache");
exports.resourceCache = cache_1.resourceCache;
const dataReaderInitializer_1 = require("./dataReaderInitializer");
exports.preloadResource = dataReaderInitializer_1.initializeDataReader;
const AsyncResourceContent_1 = __importDefault(require("./AsyncResourceContent"));
exports.AsyncResourceContent = AsyncResourceContent_1.default;
//# sourceMappingURL=index.js.map