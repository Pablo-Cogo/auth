"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ErroException_1 = require("@src/exceptions/ErroException");
const crypto = __importStar(require("crypto"));
const dayjs_1 = __importDefault(require("dayjs"));
const customParseFormat_1 = __importDefault(require("dayjs/plugin/customParseFormat"));
class HelperService {
    static isValidUrl(url) {
        try {
            new URL(url);
            return true;
        }
        catch (error) {
            return false;
        }
    }
    static isJson(str) {
        try {
            JSON.parse(str);
            return true;
        }
        catch (e) {
            return false;
        }
    }
    static generateApiKey() {
        const apiKey = crypto.randomBytes(32).toString("hex");
        console.log("API Key gerada:", apiKey);
    }
    static convertTimeToDaysJs(value) {
        const match = value.match(/(\d+)(.*?)$/);
        if (match) {
            const num = parseInt(match[1]);
            const type = match[2];
            return (0, dayjs_1.default)().add(num, type);
        }
        else {
            throw new ErroException_1.ErroException("Erro interno: falha ao realizar a conversão de datas.");
        }
    }
    static convertStringToDaysJs(dateString, format = "DD/MM/YYYY HH:mm:ss") {
        dayjs_1.default.extend(customParseFormat_1.default);
        return (0, dayjs_1.default)(dateString, format);
    }
}
exports.default = HelperService;
//# sourceMappingURL=helpers.js.map