"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = require("@src/model/user.model");
const entities_1 = require("@src/validators/entities");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const ErroException_1 = require("@src/exceptions/ErroException");
const FalhaException_1 = require("@src/exceptions/FalhaException");
const base_service_1 = require("../base.service");
const password_service_1 = __importDefault(require("../Auth/API/password.service"));
class UserService extends base_service_1.BaseService {
    constructor() {
        super();
    }
    async createUser(user) {
        const userData = (0, class_transformer_1.plainToClass)(user_model_1.UserModel, user);
        const errors = await (0, class_validator_1.validate)(userData);
        (0, entities_1.validarErrosEntidade)(errors);
        const user_password = await password_service_1.default.hashPassword(userData.user_password);
        const userCreated = await this.client.user.create({
            data: { ...userData, user_password },
        });
        return userCreated;
    }
    async getUserByParam(param, value, select) {
        const user = this.client.user.findFirst({
            select,
            where: {
                [param]: value,
            },
        });
        return user;
    }
    async editUser(id, updatedUserData) {
        const userData = (0, class_transformer_1.plainToClass)(user_model_1.UserModel, updatedUserData);
        const updatedData = Object.entries(updatedUserData)
            .filter(([_, value]) => value !== null && value !== undefined)
            .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
        const errors = await (0, class_validator_1.validate)(userData, {
            skipMissingProperties: true,
            validationError: { target: false },
            forbidUnknownValues: true,
        });
        (0, entities_1.validarErrosEntidade)(errors);
        if (Object.keys(updatedData).length === 0) {
            throw new ErroException_1.ErroException("Nenhum dado encontrado.", 400);
        }
        try {
            let userUpdated;
            if (updatedData.user_password) {
                const user_password = await password_service_1.default.hashPassword(userData.user_password);
                userUpdated = await this.client.user.update({
                    where: { id },
                    data: { ...updatedData, user_password },
                });
            }
            else {
                userUpdated = await this.client.user.update({
                    where: { id },
                    data: updatedData,
                });
            }
            return userUpdated;
        }
        catch (error) {
            if (error instanceof Error) {
                if (error.name.includes("PrismaClientValidationError")) {
                    throw new FalhaException_1.FalhaException("Erro na validação dos campos do usuário.", 400);
                }
            }
            throw new ErroException_1.ErroException("Erro ao atualizar o usuário.", 400);
        }
    }
    async deleteUser(id) {
        try {
            await this.client.user.findFirstOrThrow({
                where: { id },
            });
        }
        catch (error) {
            throw new FalhaException_1.FalhaException("Erro ao encontrar o usuário");
        }
        return this.client.user.delete({
            where: { id },
        });
    }
    async getAllUsers(paramsSelect) {
        const users = await this.client.user.findMany({
            select: paramsSelect !== null && paramsSelect !== void 0 ? paramsSelect : null,
        });
        return users;
    }
}
exports.default = UserService;
//# sourceMappingURL=user.service.js.map