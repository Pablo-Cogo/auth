"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const core_1 = require("@overnightjs/core");
const generic_1 = require("@src/middleware/generic");
const config_1 = __importDefault(require("config"));
const retornoDTo_1 = require("@src/dto/retornoDTo");
const user_role_1 = require("@src/enums/user_role");
const FalhaException_1 = require("@src/exceptions/FalhaException");
const user_service_1 = __importDefault(require("@src/services/User/user.service"));
const google_service_1 = __importDefault(require("@src/services/Auth/Google/google.service"));
const ErroException_1 = require("@src/exceptions/ErroException");
const password_service_1 = __importDefault(require("@src/services/Auth/API/password.service"));
const access_token_service_1 = require("@src/services/Auth/Token/access-token.service");
const auth_1 = require("@src/middleware/auth");
const session_service_1 = require("@src/services/Auth/API/session.service");
let AuthController = class AuthController {
    constructor(userService, sessionService, accessTokenService) {
        this.userService = userService;
        this.sessionService = sessionService;
        this.accessTokenService = accessTokenService;
    }
    async authenticateApi(req, res) {
        const { api_key } = req.body;
        const admApiKey = config_1.default.get("App.adm-api-key");
        const employeeApiKey = config_1.default.get("App.api-key");
        var role = user_role_1.userRole.USER;
        switch (api_key) {
            case admApiKey:
                role = user_role_1.userRole.ADMIN;
                break;
            case employeeApiKey:
                role = user_role_1.userRole.EMPLOYEE;
                break;
            default:
                throw new FalhaException_1.FalhaException("Acesso não autorizado", 403);
        }
        const decodedToken = {
            sub: undefined,
            role,
        };
        const access_token = this.accessTokenService.create(decodedToken, "1d");
        const retorno = new retornoDTo_1.RetornoDTo({
            code: 200,
            sucesso: true,
            dados: [access_token],
        });
        res.status(200).send(retorno);
    }
    async login(req, res) {
        var _a;
        const { user_email, user_password } = req.body;
        const user = await this.userService.getUserByParam("user_email", user_email, {
            id: true,
            user_password: true,
            user_role: true,
            user_name: true,
            user_email: true,
            avatar_url: true,
        });
        if (!user) {
            throw new FalhaException_1.FalhaException("Usuário não encontrado.", 401);
        }
        const comparePasswords = await password_service_1.default.comparePasswords(user_password, (_a = user.user_password) !== null && _a !== void 0 ? _a : "");
        if (!comparePasswords) {
            throw new FalhaException_1.FalhaException("Usuário não encontrado.", 401);
        }
        const decodedToken = {
            sub: user.id,
            role: user_role_1.userRole[user.user_role],
        };
        const access_token = this.accessTokenService.create(decodedToken);
        var refresh_token = null;
        try {
            refresh_token = await this.sessionService.create(decodedToken, user, req);
        }
        catch (error) {
            if (!(error instanceof ErroException_1.ErroException)) {
                throw error;
            }
        }
        if (refresh_token == null)
            throw new ErroException_1.ErroException("Ocorreu um erro interno ao realizar o login, erro ao gerar o token de acesso.");
        const { user_name, user_email: email, avatar_url } = user;
        const retorno = new retornoDTo_1.RetornoDTo({
            code: 200,
            sucesso: true,
            dados: [
                {
                    access_token,
                    refresh_token,
                    user: {
                        user_email: email,
                        user_name,
                        avatar_url,
                    },
                },
            ],
        });
        res.status(200).send(retorno);
    }
    async refreshToken(req, res) {
        const { token } = req.body;
        if (!token) {
            throw new FalhaException_1.FalhaException("Não foi possivel atualizar suas credenciais de acesso, realize o login novamente.");
        }
        try {
            const { access_token, refresh_token } = await this.sessionService.refresh(token, req);
            const retorno = new retornoDTo_1.RetornoDTo({
                code: 200,
                sucesso: true,
                dados: [
                    {
                        access_token,
                        refresh_token,
                    },
                ],
            });
            res.status(200).send(retorno);
        }
        catch (error) {
            if (error instanceof ErroException_1.ErroException) {
                throw new ErroException_1.ErroException("Não foi possivel atualizar suas credenciais de acesso, realize o login novamente.");
            }
            throw error;
        }
    }
    async validateToken(req, res) {
        const { token } = req.body;
        if (!token) {
            throw new FalhaException_1.FalhaException("Não foi possivel validar sua sessão, realize o login novamente.", 403);
        }
        try {
            this.accessTokenService.decode(token);
            const retorno = new retornoDTo_1.RetornoDTo({
                code: 200,
                sucesso: true,
                dados: [],
                mensagem: "token válido.",
            });
            res.status(200).send(retorno);
        }
        catch (err) {
            throw new FalhaException_1.FalhaException("Erro de autenticação", 401);
        }
    }
    async edit(req, res) {
        const idQuery = req.query.user_id;
        const token = this.accessTokenService.getToken(req);
        const { is } = auth_1.AuthMiddleware.isTypeUser(req, user_role_1.userRole.ADMIN);
        let user_id;
        if (is) {
            if (!idQuery) {
                throw new FalhaException_1.FalhaException("Erro ao obter o usuário", 404);
            }
            user_id = idQuery.toString();
        }
        else {
            const { sub } = this.accessTokenService.decode(token);
            if (sub != idQuery) {
                throw new FalhaException_1.FalhaException("Acesso não autorizado", 403);
            }
            user_id = sub;
        }
        if (!user_id) {
            throw new FalhaException_1.FalhaException("Erro ao obter o usuário", 404);
        }
        const success = await this.sessionService.deleteAllByUser(user_id);
        if (success) {
            const retorno = new retornoDTo_1.RetornoDTo({
                code: 200,
                sucesso: true,
                mensagem: `Sessões do usuário ${user_id} deletadas com sucesso.`,
            });
            res.status(200).json(retorno);
        }
        else {
            const retorno = new retornoDTo_1.RetornoDTo({
                code: 404,
                sucesso: false,
                mensagem: `Não foi possivel deletar as sessões do usuário: ${user_id.toString()}.`,
            });
            res.status(404).json(retorno);
        }
    }
    async getUrlGoogle(req, res) {
        const redirect = req.query.redirect;
        const url = await google_service_1.default.getAuthUrl(typeof redirect === "string" ? redirect : null);
        const retorno = new retornoDTo_1.RetornoDTo({
            code: 201,
            sucesso: true,
            dados: [url],
        });
        res.status(200).send(retorno);
    }
    async authGoogle(req, res) {
        const google_access_token = await google_service_1.default.getAccessToken(req.body.code);
        console.log(google_access_token);
        const response = await google_service_1.default.getUserData(google_access_token);
        const user = await this.userService.getUserByParam("user_email", response.email, {
            id: true,
            user_role: true,
        });
        if (!user) {
            if (response.email) {
                const retorno = new retornoDTo_1.RetornoDTo({
                    code: 200,
                    sucesso: true,
                    dados: [
                        {
                            user: {
                                logged: false,
                                user_email: response.email,
                                user_name: response.name,
                                avatar_url: response.picture,
                            },
                        },
                    ],
                });
                res.status(200).send(retorno);
                return;
            }
            throw new FalhaException_1.FalhaException("Usuário não encontrado.", 400);
        }
        const decodedToken = {
            sub: user.id,
            role: user_role_1.userRole[user.user_role],
        };
        const access_token = this.accessTokenService.create(decodedToken);
        const refresh_token = await this.sessionService.create(decodedToken, user, req);
        const retorno = new retornoDTo_1.RetornoDTo({
            code: 200,
            sucesso: true,
            dados: [
                {
                    access_token,
                    refresh_token,
                    user: {
                        logged: true,
                        user_email: response.email,
                        user_name: response.name,
                        avatar_url: response.picture,
                    },
                },
            ],
        });
        res.status(200).send(retorno);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, core_1.Post)("api"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "authenticateApi", null);
__decorate([
    (0, core_1.Post)("login"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, core_1.Post)("refresh-token"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refreshToken", null);
__decorate([
    (0, core_1.Post)("validate-token"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "validateToken", null);
__decorate([
    (0, core_1.Delete)("delete-all-sessions"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "edit", null);
__decorate([
    (0, core_1.Get)("google/url"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getUrlGoogle", null);
__decorate([
    (0, core_1.Post)("google"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "authGoogle", null);
exports.AuthController = AuthController = __decorate([
    (0, core_1.Controller)("auth"),
    generic_1.safeExecution,
    __metadata("design:paramtypes", [user_service_1.default,
        session_service_1.SessionService,
        access_token_service_1.AccessTokenService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map