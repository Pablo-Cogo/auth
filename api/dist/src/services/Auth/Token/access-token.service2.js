"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessTokenService = void 0;
const helpers_1 = __importDefault(require("@src/services/helpers"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("config"));
class AccessTokenService {
    constructor() {
        this.accessTokenSecret = config_1.default.get("App.auth.access_token_secret");
        this.accessTokenExpiresIn = config_1.default.get("App.auth.access_token_expires_in");
    }
    getToken(req) {
        var _a;
        const token = (((_a = req.headers) === null || _a === void 0 ? void 0 : _a["authorization"]) || "").toString();
        if (token.startsWith("Bearer")) {
            return token.replace("Bearer", "").trim();
        }
        return token;
    }
    create(data, expiresIn) {
        const expires = expiresIn || this.accessTokenExpiresIn;
        const dateConverted = helpers_1.default.convertTimeToDaysJs(expires);
        const decodedToken = typeof data === "string" && helpers_1.default.isJson(data)
            ? JSON.parse(data)
            : data;
        const token = jsonwebtoken_1.default.sign(decodedToken, this.accessTokenSecret, {
            expiresIn: expires,
        });
        return {
            token,
            expires_in: dateConverted.format("DD/MM/YYYY HH:mm:ss"),
        };
    }
    decode(token) {
        return jsonwebtoken_1.default.verify(token, this.accessTokenSecret);
    }
}
exports.AccessTokenService = AccessTokenService;
//# sourceMappingURL=access-token.service2.js.map