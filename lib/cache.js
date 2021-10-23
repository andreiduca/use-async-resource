"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resourceCache = void 0;
const object_hash_1 = __importDefault(require("object-hash"));
const caches = new Map();
function resourceCache(apiFn) {
    if (!caches.has(apiFn)) {
        caches.set(apiFn, new Map());
    }
    const apiCache = caches.get(apiFn);
    return {
        get(...params) {
            return apiCache.get((0, object_hash_1.default)(params));
        },
        set(dataFn, ...params) {
            return apiCache.set((0, object_hash_1.default)(params), dataFn);
        },
        delete(...params) {
            return apiCache.delete((0, object_hash_1.default)(params));
        },
        clear() {
            caches.delete(apiFn);
            return apiCache.clear();
        },
    };
}
exports.resourceCache = resourceCache;
//# sourceMappingURL=cache.js.map