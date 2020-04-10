"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const AsyncResourceErrorBoundary_1 = __importDefault(require("./AsyncResourceErrorBoundary"));
const AsyncResourceContent = ({ children, fallback, errorMessage, errorComponent: ErrorComponent, }) => {
    const ErrorBoundary = ErrorComponent || AsyncResourceErrorBoundary_1.default;
    return (react_1.default.createElement(ErrorBoundary, { errorMessage: errorMessage },
        react_1.default.createElement(react_1.default.Suspense, { fallback: fallback }, children)));
};
exports.default = AsyncResourceContent;
//# sourceMappingURL=AsyncResourceContent.js.map