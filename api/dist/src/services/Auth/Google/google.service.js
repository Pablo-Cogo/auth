"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const google_1 = require("@src/clients/google");
class GoogleAuthService {
    static async getAuthUrl(redirectUri) {
        try {
            const authUrl = await this.googleAuth.generateAuthUrl(redirectUri);
            return authUrl;
        }
        catch (error) {
            throw new Error("Failed to generate Google authentication URL.");
        }
    }
    static async getAccessToken(authorizationCode) {
        try {
            const tokens = await this.googleAuth.getToken(authorizationCode);
            return tokens.access_token;
        }
        catch (error) {
            throw new Error("Failed to obtain access token from Google.");
        }
    }
    static async getUserData(access_token) {
        try {
            return this.googleAuth.getUserData(access_token);
        }
        catch (error) {
            throw new Error("Failed to obtain access token from Google.");
        }
    }
}
GoogleAuthService.googleAuth = new google_1.GoogleAuth();
exports.default = GoogleAuthService;
//# sourceMappingURL=google.service.js.map