"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionService = void 0;
const base_service_1 = require("@src/services/base.service");
const helpers_1 = __importDefault(require("@src/services/helpers"));
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const entities_1 = require("@src/validators/entities");
const ErroException_1 = require("@src/exceptions/ErroException");
const FalhaException_1 = require("@src/exceptions/FalhaException");
const session_model_1 = require("@src/model/session.model");
const client_service_1 = __importDefault(require("./client.service"));
class SessionService extends base_service_1.BaseService {
    constructor(accessTokenService, refreshTokenService) {
        super();
        this.accessTokenService = accessTokenService;
        this.refreshTokenService = refreshTokenService;
    }
    async create(data, user, req) {
        const refresh_token = this.refreshTokenService.create(data);
        const dateConverted = helpers_1.default.convertStringToDaysJs(refresh_token.expires_in);
        const sessionData = this._mapSessionData(refresh_token.token, user, dateConverted, req);
        const sessionCreated = await this._createSessionData(sessionData);
        return {
            token: sessionCreated.token,
            expires_in: dateConverted.format("DD/MM/YYYY HH:mm:ss"),
        };
    }
    _mapSessionData(token, user, dateConverted, req) {
        const { ip_address, country, city, device } = this._getInfosClient(req);
        return (0, class_transformer_1.plainToClass)(session_model_1.SessionModel, {
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
    }
    _getInfosClient(req) {
        const ip_address = client_service_1.default.getIpAddress(req);
        const { country, city } = client_service_1.default.getLocationByIp(ip_address);
        const device = client_service_1.default.getBrowserType(req);
        return { ip_address, country, city, device };
    }
    async _createSessionData(sessionData) {
        await this._validateSessionData(sessionData);
        return await this.client.session.create({
            data: sessionData,
        });
    }
    async _validateSessionData(sessionData) {
        var _a;
        try {
            const errors = await (0, class_validator_1.validate)(sessionData);
            (0, entities_1.validarErrosEntidade)(errors);
            const idUser = (_a = sessionData.user.connect) === null || _a === void 0 ? void 0 : _a.id;
            if (!idUser) {
                throw new ErroException_1.ErroException("Erro interno: erro ao encontrar o usuário.");
            }
        }
        catch (error) {
            if (!(error instanceof ErroException_1.ErroException)) {
                throw error;
            }
            throw new ErroException_1.ErroException("Ocorreu um erro ao validar o token de acesso, realize o login novamente.");
        }
    }
    async refresh(token, req) {
        const foundSession = await this._findSession(token);
        if (!foundSession) {
            throw new ErroException_1.ErroException("Ocorreu um erro ao obter as credenciais de acesso, realize o login novamente.");
        }
        const { sub, role } = this.refreshTokenService.decode(token);
        if (!sub)
            throw new FalhaException_1.FalhaException("Acesso não autorizado", 403);
        await this._deleteSession(foundSession.id);
        this._compareOldAndNewSession(foundSession, req);
        const refresh_token = await this._createNewSession({ sub, role }, req);
        const access_token = this.accessTokenService.create({ sub, role });
        return { access_token, refresh_token };
    }
    async _findSession(token) {
        return await this.client.session.findFirst({
            where: {
                token,
            },
        });
    }
    async _deleteSession(id) {
        await this.client.session.deleteMany({
            where: { id },
        });
    }
    _compareOldAndNewSession(oldSession, req) {
        const { ip_address, country, city, device } = this._getInfosClient(req);
        const isSameIp = oldSession.ip_address === ip_address;
        const isSameLocation = oldSession.country === country && oldSession.city === city;
        const isSameDevice = oldSession.device === device;
        if (!isSameIp || !isSameLocation || !isSameDevice) {
            throw new FalhaException_1.FalhaException("Ocorreu um erro ao validar as credenciais de acesso, realize o login novamente.");
        }
    }
    _createNewSession(oldToken, req) {
        return this.create(oldToken, {
            id: oldToken.sub,
        }, req);
    }
    async deleteAllByUser(user_id) {
        try {
            await this._findAndDeleteSession(user_id);
            return true;
        }
        catch (error) {
            return false;
        }
    }
    async _findAndDeleteSession(user_id) {
        await this.client.session.findFirstOrThrow({
            where: { user_id },
        });
        await this._deleteSessionByUser(user_id);
    }
    async _deleteSessionByUser(user_id) {
        await this.client.session.deleteMany({
            where: { user_id },
        });
    }
}
exports.SessionService = SessionService;
//# sourceMappingURL=session.service.js.map