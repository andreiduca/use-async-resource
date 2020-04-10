"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cache_1 = require("./cache");
function initializeDataReader(apiFn, ...parameters) {
    const cache = cache_1.resourceCache(apiFn, ...parameters);
    const cachedResource = cache.get();
    if (cachedResource) {
        return cachedResource;
    }
    let data;
    let status = 'init';
    let error;
    const fetchingPromise = apiFn(...parameters)
        .then(result => {
        data = result;
        status = 'done';
    })
        .catch(err => {
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
    cache.set(dataReaderFn);
    return dataReaderFn;
}
exports.initializeDataReader = initializeDataReader;
//# sourceMappingURL=dataReaderInitializer.js.map