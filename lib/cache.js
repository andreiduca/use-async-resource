"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const object_hash_1 = __importDefault(require("object-hash"));
const caches = new Map();
function resourceCache(apiFn, ...params) {
    if (!caches.has(apiFn)) {
        caches.set(apiFn, new Map());
    }
    const apiCache = caches.get(apiFn);
    const pKey = object_hash_1.default(params);
    return {
        get() {
            return apiCache.get(pKey);
        },
        set(data) {
            return apiCache.set(pKey, data);
        },
        delete() {
            return apiCache.delete(pKey);
        },
        clear() {
            caches.delete(apiFn);
            return apiCache.clear();
        },
    };
}
exports.resourceCache = resourceCache;
//# sourceMappingURL=cache.js.map