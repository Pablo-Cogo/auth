"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Request = void 0;
const axios_1 = __importDefault(require("axios"));
class Request {
    constructor(request = axios_1.default) {
        this.request = request;
    }
    get(url, config = {}) {
        return this.request.get(url, config);
    }
    static isRequestError(error) {
        var _a;
        return !!(error.response && ((_a = error.response) === null || _a === void 0 ? void 0 : _a.status));
    }
    static extractErrorData(error) {
        const axiosError = error;
        if (axiosError.response && axiosError.response.status) {
            return {
                data: axiosError.response.data,
                status: axiosError.response.status,
            };
        }
        throw Error(`The error ${error} is not a Request Error`);
    }
}
exports.Request = Request;
//# sourceMappingURL=request.js.map