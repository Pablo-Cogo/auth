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
exports.UserModel = void 0;
const class_validator_1 = require("class-validator");
const helpers_1 = __importDefault(require("@src/services/helpers"));
const isUnique_1 = require("@src/validators/isUnique");
const client_1 = require("@prisma/client");
const prisma_client_1 = require("@src/database/prisma.client");
let IsValidUrlConstraint = class IsValidUrlConstraint {
    validate(value) {
        return !value || helpers_1.default.isValidUrl(value);
    }
    defaultMessage() {
        return "URL inválida";
    }
};
IsValidUrlConstraint = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: "IsValidUrl", async: false })
], IsValidUrlConstraint);
class UserModel {
}
exports.UserModel = UserModel;
__decorate([
    (0, class_validator_1.IsEmpty)({ message: "não é possivel setar valor no id" }),
    __metadata("design:type", String)
], UserModel.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.MaxLength)(50, {
        message: "O campo [usuário] deve ter no máximo 50 caracteres.",
    }),
    (0, class_validator_1.IsNotEmpty)({ message: "O campo [usuário] é obrigatório." }),
    __metadata("design:type", String)
], UserModel.prototype, "user_name", void 0);
__decorate([
    (0, class_validator_1.IsEmail)({}, { message: "O campo [email] deve ser um email válido." }),
    (0, isUnique_1.IsUnique)(prisma_client_1.client.user, { message: "O [email] já está sendo utilizado." }),
    (0, class_validator_1.MaxLength)(254, {
        message: "O campo [email] deve ter no máximo 254 caracteres.",
    }),
    __metadata("design:type", String)
], UserModel.prototype, "user_email", void 0);
__decorate([
    (0, class_validator_1.MaxLength)(60),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UserModel.prototype, "user_password", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.UserRole, {
        message: "Valor inválido para o campo [papel do usuário].",
    }),
    __metadata("design:type", String)
], UserModel.prototype, "user_role", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Validate)(IsValidUrlConstraint, {
        message: "O campo [imagem do perfil] contem uma url inválida.",
    }),
    (0, class_validator_1.MaxLength)(254, {
        message: "O campo [imagem do perfil] deve ter no máximo 254 caracteres.",
    }),
    __metadata("design:type", String)
], UserModel.prototype, "avatar_url", void 0);
//# sourceMappingURL=user.model.js.map