"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseTokenService = void 0;
const base_service_1 = require("@src/services/base.service");
const helpers_1 = __importDefault(require("@src/services/helpers"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class BaseTokenService extends base_service_1.BaseService {
    constructor(secret, expiresIn) {
        super();
        this.secret = secret;
        this.expiresIn = expiresIn;
    }
    create(data, expiresIn) {
        const expires = expiresIn || this.expiresIn;
        const dateConverted = helpers_1.default.convertTimeToDaysJs(expires);
        const decodedToken = this.decodeTokenData(data);
        const token = this.createToken(decodedToken, expires);
        return {
            token,
            expires_in: dateConverted.format("DD/MM/YYYY HH:mm:ss"),
        };
    }
    decode(token) {
        return jsonwebtoken_1.default.verify(token, this.secret);
    }
    decodeTokenData(data) {
        if (typeof data === "string" && helpers_1.default.isJson(data)) {
            return JSON.parse(data);
        }
        return data;
    }
    createToken(decodedToken, expiresIn) {
        return jsonwebtoken_1.default.sign(decodedToken, this.secret, {
            expiresIn,
        });
    }
}
exports.BaseTokenService = BaseTokenService;
//# sourceMappingURL=base-token.service.js.map