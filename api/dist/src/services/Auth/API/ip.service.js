"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const geoip_lite_1 = __importDefault(require("geoip-lite"));
class IpService {
    static getIpAddress(req) {
        const clientIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
        if (clientIp === undefined)
            throw new Error("Cannot get client IP");
        return clientIp.toString();
    }
    static getLocationByIp(ip) {
        const ipInfo = geoip_lite_1.default.lookup(ip);
        if (ipInfo === null)
            throw new Error(`Cannot get location for IP: ${ip}`);
        return {
            country: ipInfo.country,
            city: ipInfo.city,
        };
    }
}
exports.default = IpService;
//# sourceMappingURL=ip.service.js.map