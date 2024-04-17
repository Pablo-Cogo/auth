import { Request } from "express";
import config from "config";
import { BaseTokenService } from "./base-token.service";

class AccessTokenService extends BaseTokenService {
  constructor() {
    const accessTokenSecret: string = config.get<string>(
      "App.auth.access_token_secret"
    );
    const accessTokenExpiresIn: string = config.get<string>(
      "App.auth.access_token_expires_in"
    );
    super(accessTokenSecret, accessTokenExpiresIn);
  }

  public getToken(req: Partial<Request>): string {
    const token = (req.headers?.["authorization"] || "").toString();
    if (token.startsWith("Bearer")) {
      return token.replace("Bearer", "").trim();
    }
    return token;
  }
}

export { AccessTokenService };
