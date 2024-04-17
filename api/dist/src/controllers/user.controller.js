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
exports.UserController = void 0;
const core_1 = require("@overnightjs/core");
const generic_1 = require("@src/middleware/generic");
const retornoDTo_1 = require("@src/dto/retornoDTo");
const user_role_1 = require("@src/enums/user_role");
const FalhaException_1 = require("@src/exceptions/FalhaException");
const auth_1 = require("@src/middleware/auth");
const client_1 = require("@prisma/client");
const enum_converter_1 = require("@src/converters/enum.converter");
const user_service_1 = __importDefault(require("@src/services/User/user.service"));
const access_token_service_1 = require("@src/services/Auth/Token/access-token.service");
let UserController = class UserController {
    constructor(userService, accessTokenService) {
        this.userService = userService;
        this.accessTokenService = accessTokenService;
    }
    async create(req, res) {
        const { is } = auth_1.AuthMiddleware.isTypeUser(req, user_role_1.userRole.ADMIN);
        const role = enum_converter_1.Enum.getKeyByValue(user_role_1.userRole, req.body.user_role);
        if (!role || !isNaN(Number(role))) {
            throw new FalhaException_1.FalhaException("Valor inválido para o campo [papel do usuário].", 422);
        }
        if (!is && role != client_1.UserRole.USER) {
            throw new FalhaException_1.FalhaException("Acesso não autorizado", 403);
        }
        const user = await this.userService.createUser({
            ...req.body,
            user_role: role,
        });
        const retorno = new retornoDTo_1.RetornoDTo({
            code: 201,
            sucesso: true,
            dados: [user],
            mensagem: "Usuário criado com sucesso.",
        });
        res.status(retorno.code).json(retorno);
    }
    async edit(req, res) {
        const idQuery = req.query.id;
        const token = this.accessTokenService.getToken(req);
        const { is } = auth_1.AuthMiddleware.isTypeUser(req, user_role_1.userRole.ADMIN);
        let id;
        if (is) {
            if (!idQuery) {
                throw new FalhaException_1.FalhaException("Erro ao obter o usuário", 404);
            }
            id = idQuery.toString();
        }
        else {
            const { sub } = this.accessTokenService.decode(token);
            if (sub != idQuery) {
                throw new FalhaException_1.FalhaException("Acesso não autorizado", 403);
            }
            id = sub;
        }
        if (!id) {
            throw new FalhaException_1.FalhaException("Erro ao obter o usuário", 404);
        }
        const existingUser = await this.userService.getUserByParam("id", id, {
            id: true,
            user_role: true,
        });
        if (!existingUser) {
            throw new FalhaException_1.FalhaException("Usuário não encontrado", 404);
        }
        const role = enum_converter_1.Enum.getKeyByValue(user_role_1.userRole, req.body.user_role);
        let user;
        if (role) {
            if (!is && role != existingUser.user_role) {
                throw new FalhaException_1.FalhaException("Acesso não autorizado", 403);
            }
            user = await this.userService.editUser(existingUser.id, {
                ...req.body,
                user_role: role,
            });
        }
        else {
            user = await this.userService.editUser(existingUser.id, req.body);
        }
        const retorno = new retornoDTo_1.RetornoDTo({
            code: 200,
            sucesso: true,
            dados: user ? [user] : [],
            mensagem: "Usuário alterado com sucesso.",
        });
        res.status(200).json(retorno);
    }
    async delete(req, res) {
        const { id } = req.query;
        if (!id) {
            throw new FalhaException_1.FalhaException("Erro ao obter o usuário", 404);
        }
        try {
            await this.userService.deleteUser(id.toString());
            const retorno = new retornoDTo_1.RetornoDTo({
                code: 200,
                sucesso: true,
                mensagem: `Usuário ${id} deletado com sucesso.`,
            });
            res.status(200).json(retorno);
        }
        catch (error) {
            const retorno = new retornoDTo_1.RetornoDTo({
                code: 404,
                sucesso: false,
                mensagem: `Erro ao deletar o usuário: ${id.toString()}.`,
            });
            res.status(404).json(retorno);
        }
    }
    async getAll(_, res) {
        const users = await this.userService.getAllUsers({
            id: true,
            user_name: true,
            user_email: true,
            avatar_url: true,
            updated_at: true,
        });
        const retorno = new retornoDTo_1.RetornoDTo({
            code: 200,
            sucesso: true,
            dados: users,
        });
        res.status(200).json(retorno);
    }
    async getById(req, res) {
        const { id } = req.query;
        if (!id) {
            throw new FalhaException_1.FalhaException("Erro ao obter o usuário", 404);
        }
        const user = await this.userService.getUserByParam("id", id.toString(), {
            id: true,
            user_name: true,
            user_email: true,
            avatar_url: true,
            updated_at: true,
        });
        const retorno = new retornoDTo_1.RetornoDTo({
            code: 200,
            sucesso: false,
            dados: user ? [user] : [],
        });
        res.status(200).json(retorno);
    }
};
exports.UserController = UserController;
__decorate([
    (0, core_1.Post)(""),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "create", null);
__decorate([
    (0, core_1.Put)(""),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "edit", null);
__decorate([
    (0, core_1.Delete)(""),
    (0, core_1.Middleware)(auth_1.AuthMiddleware.admin),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "delete", null);
__decorate([
    (0, core_1.Get)("list"),
    (0, core_1.Middleware)(auth_1.AuthMiddleware.employee),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getAll", null);
__decorate([
    (0, core_1.Get)(""),
    (0, core_1.Middleware)(auth_1.AuthMiddleware.employee),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getById", null);
exports.UserController = UserController = __decorate([
    (0, core_1.Controller)("user"),
    generic_1.safeExecution,
    __metadata("design:paramtypes", [user_service_1.default,
        access_token_service_1.AccessTokenService])
], UserController);
//# sourceMappingURL=user.controller.js.map