"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeDataReader = void 0;
const cache_1 = require("./cache");
function initializeDataReader(apiFn, ...parameters) {
    const apiFnCache = (0, cache_1.resourceCache)(apiFn);
    const cachedResource = apiFnCache.get(...parameters);
    if (cachedResource) {
        return cachedResource;
    }
    let data;
    let status = 'init';
    let error;
    const fetchingPromise = apiFn(...parameters)
        .then((result) => {
        data = result;
        status = 'done';
        return result;
    })
        .catch((err) => {
        error = err;
        status = 'error';
    });
    function dataReaderFn(modifier) {
        if (status === 'init') {
            throw fetchingPromise;
        }
        else if (status === 'error') {
            throw error;
        }
        return typeof modifier === 'function'
            ? modifier(data)
            : data;
    }
    apiFnCache.set(dataReaderFn, ...parameters);
    return dataReaderFn;
}
exports.initializeDataReader = initializeDataReader;
//# sourceMappingURL=dataReaderInitializer.js.map