import { BaseService } from "@src/services/base.service";
import HelperService from "@src/services/helpers";
import jwt from "jsonwebtoken";
import { JwtToken } from "@src/services/base.token.service";
import { TokenDTo } from "@src/dto/retornoTokenDTo";

export abstract class BaseTokenService extends BaseService {
  constructor(private secret: string, private expiresIn: string) {
    super();
  }

  public create(
    data: string | Record<string, any>,
    expiresIn?: string
  ): TokenDTo {
    const expires = expiresIn || this.expiresIn;
    const dateConverted = HelperService.convertTimeToDaysJs(expires);
    const decodedToken = this.decodeTokenData(data);
    const token = this.createToken(decodedToken, expires);
    return {
      token,
      expires_in: dateConverted.format("DD/MM/YYYY HH:mm:ss"),
    };
  }

  public decode<T>(token: string): T {
    return jwt.verify(token, this.secret) as T;
  }

  protected decodeTokenData(data: string | Record<string, any>) {
    if (typeof data === "string" && HelperService.isJson(data)) {
      return JSON.parse(data);
    }
    return data;
  }

  protected createToken(decodedToken: JwtToken, expiresIn: string) {
    return jwt.sign(decodedToken, this.secret, {
      expiresIn,
    });
  }
}
