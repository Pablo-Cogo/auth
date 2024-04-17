"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionService = void 0;
const base_service_1 = require("@src/services/base.service");
const config_1 = __importDefault(require("config"));
class SessionService extends base_service_1.BaseService {
    constructor(accessTokenService, refreshTokenSecret = config_1.default.get("App.auth.refresh_token_secret"), refreshTokenExpiresIn = config_1.default.get("App.auth.refresh_token_expires_in")) {
        super();
        this.accessTokenService = accessTokenService;
        this.refreshTokenSecret = refreshTokenSecret;
        this.refreshTokenExpiresIn = refreshTokenExpiresIn;
    }
}
exports.SessionService = SessionService;
//# sourceMappingURL=session.service3.js.map