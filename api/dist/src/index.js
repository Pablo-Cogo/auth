"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./server");
const session_service_1 = require("./services/Auth/API/session.service");
const access_token_service_1 = require("./services/Auth/Token/access-token.service");
const refresh_token_service_1 = require("./services/Auth/Token/refresh-token.service");
const user_service_1 = __importDefault(require("./services/User/user.service"));
const swagger_1 = require("./swagger");
(async () => {
    const userService = new user_service_1.default();
    const accessTokenService = new access_token_service_1.AccessTokenService();
    const refreshTokenService = new refresh_token_service_1.RefrershTokenService();
    const sessionService = new session_service_1.SessionService(accessTokenService, refreshTokenService);
    const server = new server_1.SetupServer(userService, sessionService, accessTokenService, refreshTokenService);
    await server.init();
    server.start();
    const app = server.getApp();
    (0, swagger_1.setupSwagger)(app);
})();
//# sourceMappingURL=index.js.map