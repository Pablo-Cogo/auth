"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefrershTokenService = void 0;
const config_1 = __importDefault(require("config"));
const base_token_service_1 = require("./base-token.service");
class RefrershTokenService extends base_token_service_1.BaseTokenService {
    constructor() {
        const refreshTokenSecret = config_1.default.get("App.auth.refresh_token_secret");
        const refreshTokenExpiresIn = config_1.default.get("App.auth.refresh_token_expires_in");
        super(refreshTokenSecret, refreshTokenExpiresIn);
    }
}
exports.RefrershTokenService = RefrershTokenService;
//# sourceMappingURL=refresh-token.service.js.map