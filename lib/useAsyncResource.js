"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const dataReaderInitializer_1 = require("./dataReaderInitializer");
function useAsyncResource(apiFunction, ...parameters) {
    const firstRender = react_1.useRef(true);
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
    react_1.useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;
        }
        else {
            updater(...parameters);
        }
    }, [...parameters]);
    return [dataReader, updater];
}
exports.useAsyncResource = useAsyncResource;
//# sourceMappingURL=useAsyncResource.js.map