"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionService = void 0;
const base_service_1 = require("@src/services/base.service");
const helpers_1 = __importDefault(require("@src/services/helpers"));
const class_transformer_1 = require("class-transformer");
const config_1 = __importDefault(require("config"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const class_validator_1 = require("class-validator");
const entities_1 = require("@src/validators/entities");
const ErroException_1 = require("@src/exceptions/ErroException");
const FalhaException_1 = require("@src/exceptions/FalhaException");
const session_model_1 = require("@src/model/session.model");
const client_service_1 = __importDefault(require("./API/client.service"));
class SessionService extends base_service_1.BaseService {
    constructor(accessTokenService) {
        super();
        this.accessTokenService = accessTokenService;
        this.refreshTokenSecret = config_1.default.get("App.auth.refresh_token_secret");
        this.refreshTokenExpiresIn = config_1.default.get("App.auth.refresh_token_expires_in");
    }
    async refresh(token, req) {
        const foundToken = await this.client.session.findFirst({
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
        const refresh_token = await this.create(tokenDecoded, {
            id: tokenDecoded.sub,
        }, req);
        const access_token = this.accessTokenService.create(tokenDecoded);
        return { access_token, refresh_token };
    }
    async create(data, user, req) {
        var _a;
        const decodedToken = typeof data === "string" && helpers_1.default.isJson(data)
            ? JSON.parse(data)
            : data;
        const expiresIn = this.refreshTokenExpiresIn;
        const dateConverted = helpers_1.default.convertTimeToDaysJs(expiresIn);
        const token = jsonwebtoken_1.default.sign(decodedToken, this.refreshTokenSecret, {
            expiresIn,
        });
        const ip_address = client_service_1.default.getIpAddress(req);
        const { country, city } = client_service_1.default.getLocationByIp(ip_address);
        const device = client_service_1.default.getBrowserType(req);
        const tokenData = (0, class_transformer_1.plainToClass)(session_model_1.SessionModel, {
            ip_address,
            country,
            city,
            token,
            device,
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
        const tokenCreated = await this.client.session.create({
            data: tokenData,
        });
        return {
            token: tokenCreated.token,
            expires_in: dateConverted.format("DD/MM/YYYY HH:mm:ss"),
        };
    }
    async deleteToken(id) {
        try {
            await this.client.session.findFirstOrThrow({
                where: { id },
            });
        }
        catch (error) {
            return true;
        }
        try {
            await this.client.session.deleteMany({
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
exports.SessionService = SessionService;
//# sourceMappingURL=session.service2.js.map