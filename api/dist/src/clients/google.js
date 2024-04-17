"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleAuth = void 0;
const config_1 = __importDefault(require("config"));
const google_auth_library_1 = require("google-auth-library");
const HTTPUtil = __importStar(require("@src/util/request"));
const googleConfig = config_1.default.get("App.google");
class GoogleAuth {
    constructor(request = new HTTPUtil.Request()) {
        this.request = request;
        this.scopes = [
            "https://www.googleapis.com/auth/userinfo.email",
            "https://www.googleapis.com/auth/userinfo.profile",
        ];
        this.authClient = new google_auth_library_1.OAuth2Client({
            clientId: googleConfig.get("clientId"),
            clientSecret: googleConfig.get("clientSecret"),
            redirectUri: googleConfig.get("redirectUri"),
        });
    }
    async generateAuthUrl(redirect) {
        this.updateRedirectUri(redirect);
        const authUrl = this.authClient.generateAuthUrl({
            access_type: "offline",
            scope: this.scopes,
        });
        return authUrl;
    }
    async getToken(code) {
        const { tokens } = await this.authClient.getToken(code);
        return tokens;
    }
    async getUserData(access_token) {
        const response = await this.request.get(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`);
        return response.data;
    }
    updateRedirectUri(redirect) {
        this.authClient = new google_auth_library_1.OAuth2Client({
            clientId: googleConfig.get("clientId"),
            clientSecret: googleConfig.get("clientSecret"),
            redirectUri: `${googleConfig.get("redirectUri")}${redirect !== null && redirect !== void 0 ? redirect : ""}`,
        });
    }
}
exports.GoogleAuth = GoogleAuth;
//# sourceMappingURL=google.js.map