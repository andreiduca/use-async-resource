"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
class AsyncResourceErrorBoundary extends react_1.default.Component {
    static getDerivedStateFromError(error) {
        return { error };
    }
    static getDerivedStateFromProps({ errorMessage }, state) {
        if (state.error) {
            return {
                errorMessage: typeof errorMessage === 'function'
                    ? errorMessage(state.error)
                    : (errorMessage || state.error.message),
            };
        }
        return state;
    }
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        if (this.state.errorMessage) {
            return this.state.errorMessage;
        }
        return this.props.children;
    }
}
exports.default = AsyncResourceErrorBoundary;
//# sourceMappingURL=AsyncResourceErrorBoundary.js.map