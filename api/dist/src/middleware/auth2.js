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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMiddleware = exports.isTypeUser = void 0;
const FalhaException_1 = require("@src/exceptions/FalhaException");
const generic_1 = require("./generic");
const user_role_1 = require("@src/enums/user_role");
const access_token_service_1 = require("@src/services/Auth/Token/access-token.service");
function isTypeUser(req, role) {
    const accessTokenService = new access_token_service_1.AccessTokenService();
    const token = accessTokenService.getToken(req);
    if (token) {
        let claims = null;
        try {
            claims = accessTokenService.decode(token);
        }
        catch (err) {
            throw new FalhaException_1.FalhaException("Erro de autenticação", 401);
        }
        if (!claims || claims.role < user_role_1.userRole.ADMIN || claims.role > role) {
            return { is: false };
        }
        return { is: true, claims: { sub: claims === null || claims === void 0 ? void 0 : claims.sub, role: claims.role } };
    }
    return { is: false };
}
exports.isTypeUser = isTypeUser;
function validateAdmin(req, _, next) {
    const { is, claims } = isTypeUser(req, user_role_1.userRole.ADMIN);
    if (!is || !claims) {
        throw new FalhaException_1.FalhaException("Acesso não autorizado", 403);
    }
    req.context = claims;
    next();
}
function validateEmployee(req, _, next) {
    const { is, claims } = isTypeUser(req, user_role_1.userRole.EMPLOYEE);
    if (!is || !claims) {
        throw new FalhaException_1.FalhaException("Acesso não autorizado", 403);
    }
    req.context = claims;
    next();
}
function validateUser(req, _, next) {
    const { is, claims } = isTypeUser(req, user_role_1.userRole.USER);
    if (!is || !claims) {
        throw new FalhaException_1.FalhaException("Acesso não autorizado", 403);
    }
    req.context = claims;
    next();
}
class AuthMiddleware {
    static admin(req, res, next) {
        validateAdmin(req, res, next);
    }
    static employee(req, res, next) {
        validateEmployee(req, res, next);
    }
    static user(req, res, next) {
        validateUser(req, res, next);
    }
}
exports.AuthMiddleware = AuthMiddleware;
__decorate([
    generic_1.safeExecutionFunction,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", void 0)
], AuthMiddleware, "admin", null);
__decorate([
    generic_1.safeExecutionFunction,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", void 0)
], AuthMiddleware, "employee", null);
__decorate([
    generic_1.safeExecutionFunction,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", void 0)
], AuthMiddleware, "user", null);
//# sourceMappingURL=auth2.js.map