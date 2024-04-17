"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshTokenService = void 0;
const refresh_token_model_1 = require("@src/model/refresh-token.model");
const base_service_1 = require("@src/services/base.service");
const helpers_1 = __importDefault(require("@src/services/helpers"));
const class_transformer_1 = require("class-transformer");
const config_1 = __importDefault(require("config"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const class_validator_1 = require("class-validator");
const entities_1 = require("@src/validators/entities");
const ErroException_1 = require("@src/exceptions/ErroException");
const FalhaException_1 = require("@src/exceptions/FalhaException");
const access_token_service_1 = require("./access-token.service");
class RefreshTokenService extends base_service_1.BaseService {
    constructor() {
        super();
        this.refreshTokenSecret = config_1.default.get("App.auth.refresh_token_secret");
        this.refreshTokenExpiresIn = config_1.default.get("App.auth.refresh_token_expires_in");
    }
    async refresh(token) {
        const foundToken = await this.client.refreshToken.findFirst({
            where: {
                token,
            },
        });
        if (!foundToken) {
            throw new FalhaException_1.FalhaException("Token não encontrado.", 403);
        }
        const { sub, role } = jsonwebtoken_1.default.verify(token, this.refreshTokenSecret);
        const success = await this.deleteToken(foundToken.id);
        if (!success || !sub) {
            throw new FalhaException_1.FalhaException("Acesso não autorizado", 403);
        }
        const tokenDecoded = {
            sub: sub,
            role: role,
        };
        const accessTokenService = new access_token_service_1.AccessTokenService();
        const refresh_token = await this.create(tokenDecoded, {
            id: tokenDecoded.sub,
        });
        const access_token = accessTokenService.create(tokenDecoded);
        return { access_token, refresh_token };
    }
    async create(data, user) {
        var _a;
        const decodedToken = typeof data === "string" && helpers_1.default.isJson(data)
            ? JSON.parse(data)
            : data;
        const expiresIn = this.refreshTokenExpiresIn;
        const dateConverted = helpers_1.default.convertTimeToDaysJs(expiresIn);
        const token = jsonwebtoken_1.default.sign(decodedToken, this.refreshTokenSecret, {
            expiresIn,
        });
        const tokenData = (0, class_transformer_1.plainToClass)(refresh_token_model_1.RefreshTokenModel, {
            token,
            expires_in: dateConverted.unix(),
            user: {
                connect: user,
            },
        });
        const errors = await (0, class_validator_1.validate)(tokenData);
        (0, entities_1.validarErrosEntidade)(errors);
        const idUser = (_a = tokenData.user.connect) === null || _a === void 0 ? void 0 : _a.id;
        if (!idUser) {
            throw new ErroException_1.ErroException("Erro interno: erro ao encontrar o usuário.");
        }
        const tokenCreated = await this.client.refreshToken.create({
            data: tokenData,
        });
        return {
            token: tokenCreated.token,
            expires_in: dateConverted.format("DD/MM/YYYY HH:mm:ss"),
        };
    }
    async deleteToken(id) {
        try {
            await this.client.refreshToken.findFirstOrThrow({
                where: { id },
            });
        }
        catch (error) {
            return true;
        }
        try {
            await this.client.refreshToken.deleteMany({
                where: { id },
            });
        }
        catch (error) {
            return false;
        }
        return true;
    }
    decode(token) {
        return jsonwebtoken_1.default.verify(token, this.refreshTokenSecret);
    }
}
exports.RefreshTokenService = RefreshTokenService;
//# sourceMappingURL=refresh-token.service.js.map