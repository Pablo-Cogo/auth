"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
class AuthService {
    static async hashPassword(password, salt = 10) {
        return await bcrypt_1.default.hash(password, salt);
    }
    static async comparePasswords(password, hashedPassword) {
        return await bcrypt_1.default.compare(password, hashedPassword);
    }
}
exports.default = AuthService;
//# sourceMappingURL=auth.service.js.map