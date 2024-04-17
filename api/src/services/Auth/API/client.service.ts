import { Request } from "express";
import geoip from "geoip-lite";
import config from "config";

interface GeoIPProps {
  country: string;
  city: string;
}

export default class ClientService {
  public static getIpAddress(req: Request): string {
    const local: boolean = config.get<boolean>("App.local");
    if (local) {
      return config.get<string>("App.ip");
    } else {
      var xForwardedFor = (
        req.headers["x-forwarded-for"]?.toString() || ""
      ).replace(/:\d+$/, "");
      const clientIp = xForwardedFor || req.socket.remoteAddress;
      if (clientIp === undefined) throw new Error("Cannot get client IP");
      return clientIp.toString();
    }
  }

  public static getLocationByIp(ip: string): GeoIPProps {
    if (ip.includes("::ffff:")) {
      ip = ip.split(":").reverse()[0];
    }
    const ipInfo = geoip.lookup(ip);
    if (ipInfo === null) throw new Error(`Cannot get location for IP: ${ip}`);
    return {
      country: ipInfo.country,
      city: ipInfo.city,
    };
  }

  public static getBrowserType(req: Request): string {
    let browserType: string;
    let version: string | undefined;
    const userAgent = req.headers["user-agent"];

    if (!userAgent) return `Unknown`;

    if (userAgent.includes("Edg")) {
      browserType = "Edge";
      version = userAgent.match(/Edg\/(\d+\.\d+)/)?.[1];
    } else if (userAgent.includes("MSIE") || userAgent.includes("Trident")) {
      browserType = "IE";
      version = userAgent.match(/rv:(\d+\.\d+)/)?.[1];
    } else if (userAgent.includes("Firefox")) {
      browserType = "Firefox";
      version = userAgent.match(/Firefox\/(\d+\.\d+)/)?.[1];
    } else if (userAgent.includes("Opera")) {
      browserType = "Opera";
      version = userAgent.match(/OPR\/(\d+\.\d+)/)?.[1];
    } else if (userAgent.includes("Chrome")) {
      browserType = "Chrome";
      version = userAgent.match(/Chrome\/(\d+\.\d+)/)?.[1];
    } else if (userAgent.includes("Safari")) {
      browserType = "Safari";
      version = userAgent.match(/Version\/(\d+\.\d+)/)?.[1];
    } else {
      return `Unknown`;
    }

    return `${browserType} ${version}`;
  }
}
