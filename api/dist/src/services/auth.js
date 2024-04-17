"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AuthService {
    static async hashPassword(password, salt = 10) {
        return "";
    }
    static async comparePasswords(password, hashedPassword) {
        return true;
    }
}
exports.default = AuthService;
//# sourceMappingURL=auth.js.map