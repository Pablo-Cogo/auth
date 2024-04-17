import { FalhaException } from "@src/exceptions/FalhaException";
import { NextFunction, Request, Response } from "express";
import { safeExecutionFunction } from "./generic";
import { userRole } from "@src/enums/user_role";
import { JwtToken } from "@src/services/base.token.service";
import { AccessTokenService } from "@src/services/Auth/Token/access-token.service";

export type isAdmType = {
  is: boolean;
  claims?: JwtToken;
};

export function isTypeUser(req: Request, role: userRole): isAdmType {
  const accessTokenService = new AccessTokenService();
  const token = accessTokenService.getToken(req);
  if (token) {
    let claims: JwtToken | null = null;
    try {
      claims = accessTokenService.decode<JwtToken>(token);
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

function validateAdmin(req: Request, _: Response, next: NextFunction) {
  const { is, claims } = isTypeUser(req, userRole.ADMIN);
  if (!is || !claims) {
    throw new FalhaException("Acesso não autorizado", 403);
  }
  req.context = claims;
  next();
}

function validateEmployee(req: Request, _: Response, next: NextFunction) {
  const { is, claims } = isTypeUser(req, userRole.EMPLOYEE);
  if (!is || !claims) {
    throw new FalhaException("Acesso não autorizado", 403);
  }
  req.context = claims;
  next();
}

function validateUser(req: Request, _: Response, next: NextFunction) {
  const { is, claims } = isTypeUser(req, userRole.USER);
  if (!is || !claims) {
    throw new FalhaException("Acesso não autorizado", 403);
  }
  req.context = claims;
  next();
}

export class AuthMiddleware {
  @safeExecutionFunction
  public static admin(req: Request, res: Response, next: NextFunction): void {
    validateAdmin(req, res, next);
  }
  @safeExecutionFunction
  public static employee(
    req: Request,
    res: Response,
    next: NextFunction
  ): void {
    validateEmployee(req, res, next);
  }
  @safeExecutionFunction
  public static user(req: Request, res: Response, next: NextFunction): void {
    validateUser(req, res, next);
  }
}
