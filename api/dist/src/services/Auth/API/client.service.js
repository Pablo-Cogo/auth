"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const geoip_lite_1 = __importDefault(require("geoip-lite"));
const config_1 = __importDefault(require("config"));
class ClientService {
    static getIpAddress(req) {
        var _a;
        const local = config_1.default.get("App.local");
        if (local) {
            return config_1.default.get("App.ip");
        }
        else {
            var xForwardedFor = (((_a = req.headers["x-forwarded-for"]) === null || _a === void 0 ? void 0 : _a.toString()) || "").replace(/:\d+$/, "");
            const clientIp = xForwardedFor || req.socket.remoteAddress;
            if (clientIp === undefined)
                throw new Error("Cannot get client IP");
            return clientIp.toString();
        }
    }
    static getLocationByIp(ip) {
        if (ip.includes("::ffff:")) {
            ip = ip.split(":").reverse()[0];
        }
        const ipInfo = geoip_lite_1.default.lookup(ip);
        if (ipInfo === null)
            throw new Error(`Cannot get location for IP: ${ip}`);
        return {
            country: ipInfo.country,
            city: ipInfo.city,
        };
    }
    static getBrowserType(req) {
        var _a, _b, _c, _d, _e, _f;
        let browserType;
        let version;
        const userAgent = req.headers["user-agent"];
        if (!userAgent)
            return `Unknown`;
        if (userAgent.includes("Edg")) {
            browserType = "Edge";
            version = (_a = userAgent.match(/Edg\/(\d+\.\d+)/)) === null || _a === void 0 ? void 0 : _a[1];
        }
        else if (userAgent.includes("MSIE") || userAgent.includes("Trident")) {
            browserType = "IE";
            version = (_b = userAgent.match(/rv:(\d+\.\d+)/)) === null || _b === void 0 ? void 0 : _b[1];
        }
        else if (userAgent.includes("Firefox")) {
            browserType = "Firefox";
            version = (_c = userAgent.match(/Firefox\/(\d+\.\d+)/)) === null || _c === void 0 ? void 0 : _c[1];
        }
        else if (userAgent.includes("Opera")) {
            browserType = "Opera";
            version = (_d = userAgent.match(/OPR\/(\d+\.\d+)/)) === null || _d === void 0 ? void 0 : _d[1];
        }
        else if (userAgent.includes("Chrome")) {
            browserType = "Chrome";
            version = (_e = userAgent.match(/Chrome\/(\d+\.\d+)/)) === null || _e === void 0 ? void 0 : _e[1];
        }
        else if (userAgent.includes("Safari")) {
            browserType = "Safari";
            version = (_f = userAgent.match(/Version\/(\d+\.\d+)/)) === null || _f === void 0 ? void 0 : _f[1];
        }
        else {
            return `Unknown`;
        }
        return `${browserType} ${version}`;
    }
}
exports.default = ClientService;
//# sourceMappingURL=client.service.js.map