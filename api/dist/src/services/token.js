"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("config"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const helpers_1 = __importDefault(require("./helpers"));
class TokenService {
    static getToken(req) {
        var _a, _b;
        var token = ((_b = (_a = req.headers) === null || _a === void 0 ? void 0 : _a["authorization"]) !== null && _b !== void 0 ? _b : "").toString();
        if (token.includes("Bearer")) {
            token = token.replace("Bearer", "").trim();
        }
        return token;
    }
    static encodeStringToToken(str, expiresIn) {
        var isJson = helpers_1.default.isJson(str);
        if (isJson)
            str = JSON.parse(str);
        return jsonwebtoken_1.default.sign(str, config_1.default.get("App.auth.key"), {
            expiresIn: expiresIn !== null && expiresIn !== void 0 ? expiresIn : config_1.default.get("App.auth.tokenExpiresIn"),
        });
    }
    static decodeTokenToJson(token) {
        return jsonwebtoken_1.default.verify(token, config_1.default.get("App.auth.key"));
    }
}
exports.default = TokenService;
//# sourceMappingURL=token.js.map