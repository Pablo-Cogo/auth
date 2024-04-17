"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessTokenService = void 0;
const config_1 = __importDefault(require("config"));
const base_token_service_1 = require("./base-token.service");
class AccessTokenService extends base_token_service_1.BaseTokenService {
    constructor() {
        const accessTokenSecret = config_1.default.get("App.auth.access_token_secret");
        const accessTokenExpiresIn = config_1.default.get("App.auth.access_token_expires_in");
        super(accessTokenSecret, accessTokenExpiresIn);
    }
    getToken(req) {
        var _a;
        const token = (((_a = req.headers) === null || _a === void 0 ? void 0 : _a["authorization"]) || "").toString();
        if (token.startsWith("Bearer")) {
            return token.replace("Bearer", "").trim();
        }
        return token;
    }
}
exports.AccessTokenService = AccessTokenService;
//# sourceMappingURL=access-token.service.js.map