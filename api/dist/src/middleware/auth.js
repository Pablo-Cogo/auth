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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMiddleware = void 0;
const FalhaException_1 = require("@src/exceptions/FalhaException");
const user_role_1 = require("@src/enums/user_role");
const generic_1 = require("./generic");
class AuthMiddleware {
    static initialize({ accessTokenService }) {
        _a.accessTokenService = accessTokenService;
    }
    static isTypeUser(req, role) {
        const token = _a.accessTokenService.getToken(req);
        if (token) {
            let claims = null;
            try {
                claims = _a.accessTokenService.decode(token);
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
    static admin(req, res, next) {
        _a.validateRole(req, res, next, user_role_1.userRole.ADMIN);
    }
    static employee(req, res, next) {
        _a.validateRole(req, res, next, user_role_1.userRole.EMPLOYEE);
    }
    static user(req, res, next) {
        _a.validateRole(req, res, next, user_role_1.userRole.USER);
    }
}
exports.AuthMiddleware = AuthMiddleware;
_a = AuthMiddleware;
AuthMiddleware.validateRole = (req, _, next, role) => {
    const { is, claims } = _a.isTypeUser(req, role);
    if (!is || !claims) {
        throw new FalhaException_1.FalhaException("Acesso não autorizado", 403);
    }
    req.context = claims;
    next();
};
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
//# sourceMappingURL=auth.js.map