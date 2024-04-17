import config from "config";
import { BaseTokenService } from "./base-token.service";

class RefrershTokenService extends BaseTokenService {
  constructor() {
    const refreshTokenSecret: string = config.get(
      "App.auth.refresh_token_secret"
    );
    const refreshTokenExpiresIn: string = config.get(
      "App.auth.refresh_token_expires_in"
    );
    super(refreshTokenSecret, refreshTokenExpiresIn);
  }
}

export { RefrershTokenService };
