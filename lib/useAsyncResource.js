"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const dataReaderInitializer_1 = require("./dataReaderInitializer");
function useAsyncResource(apiFunction, ...parameters) {
    const [dataReader, updateDataReader] = react_1.useState(() => {
        if (!parameters.length) {
            return (() => undefined);
        }
        if (!apiFunction.length &&
            parameters.length === 1 &&
            Array.isArray(parameters[0]) &&
            parameters[0].length === 0) {
            return dataReaderInitializer_1.initializeDataReader(apiFunction);
        }
        return dataReaderInitializer_1.initializeDataReader(apiFunction, ...parameters);
    });
    const updater = react_1.useCallback((...newParameters) => {
        updateDataReader(() => dataReaderInitializer_1.initializeDataReader(apiFunction, ...newParameters));
    }, [apiFunction]);
    return [dataReader, updater];
}
exports.useAsyncResource = useAsyncResource;
//# sourceMappingURL=useAsyncResource.js.map