import { FalhaException } from "@src/exceptions/FalhaException";
import { NextFunction, Request, Response } from "express";
import { userRole } from "@src/enums/user_role";
import { JwtToken } from "@src/services/base.token.service";
import { AccessTokenService } from "@src/services/Auth/Token/access-token.service";
import { safeExecutionFunction } from "./generic";

export type isAdmType = {
  is: boolean;
  claims?: JwtToken;
};

export interface AuthMiddlewareDependencies {
  accessTokenService: AccessTokenService;
}

export class AuthMiddleware {
  private static accessTokenService: AccessTokenService;

  public static initialize({ accessTokenService }: AuthMiddlewareDependencies) {
    AuthMiddleware.accessTokenService = accessTokenService;
  }

  public static isTypeUser(req: Request, role: userRole): isAdmType {
    const token = AuthMiddleware.accessTokenService.getToken(req);
    if (token) {
      let claims: JwtToken | null = null;
      try {
        claims = AuthMiddleware.accessTokenService.decode<JwtToken>(token);
      } catch (err) {
        throw new FalhaException("Erro de autenticação", 401);
      }
      if (!claims || claims.role < userRole.ADMIN || claims.role > role) {
        return { is: false };
      }

      return { is: true, claims: { sub: claims?.sub, role: claims.role } };
    }
    return { is: false };
  }

  private static validateRole = (
    req: Request,
    _: Response,
    next: NextFunction,
    role: userRole
  ) => {
    const { is, claims } = this.isTypeUser(req, role);
    if (!is || !claims) {
      throw new FalhaException("Acesso não autorizado", 403);
    }
    req.context = claims;
    next();
  };

  @safeExecutionFunction
  static admin(req: Request, res: Response, next: NextFunction): void {
    AuthMiddleware.validateRole(req, res, next, userRole.ADMIN);
  }

  @safeExecutionFunction
  static employee(req: Request, res: Response, next: NextFunction): void {
    AuthMiddleware.validateRole(req, res, next, userRole.EMPLOYEE);
  }

  @safeExecutionFunction
  static user(req: Request, res: Response, next: NextFunction): void {
    AuthMiddleware.validateRole(req, res, next, userRole.USER);
  }
}
