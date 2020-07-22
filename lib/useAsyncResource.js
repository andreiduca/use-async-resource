"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const dataReaderInitializer_1 = require("./dataReaderInitializer");
function useAsyncResource(apiFunction, ...parameters) {
    const dataReaderObj = react_1.useRef(() => undefined);
    react_1.useMemo(() => {
        if (parameters.length) {
            if (!apiFunction.length &&
                parameters.length === 1 &&
                Array.isArray(parameters[0]) &&
                parameters[0].length === 0) {
                dataReaderObj.current = dataReaderInitializer_1.initializeDataReader(apiFunction);
            }
            else {
                dataReaderObj.current = dataReaderInitializer_1.initializeDataReader(apiFunction, ...parameters);
            }
        }
    }, [apiFunction, ...parameters]);
    const [, forceRender] = react_1.useState(0);
    const updaterFn = react_1.useCallback((...newParameters) => {
        dataReaderObj.current = dataReaderInitializer_1.initializeDataReader(apiFunction, ...newParameters);
        forceRender(ct => 1 - ct);
    }, [apiFunction]);
    return [dataReaderObj.current, updaterFn];
}
exports.useAsyncResource = useAsyncResource;
//# sourceMappingURL=useAsyncResource.js.map