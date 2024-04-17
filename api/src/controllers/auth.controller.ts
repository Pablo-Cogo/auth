import { Controller, Delete, Get, Post } from "@overnightjs/core";
import { Request, Response } from "express";
import { safeExecution } from "@src/middleware/generic";
import config from "config";
import { RetornoDTo } from "@src/dto/retornoDTo";
import { userRole } from "@src/enums/user_role";
import { FalhaException } from "@src/exceptions/FalhaException";
import UserService from "@src/services/User/user.service";
import { JwtToken } from "@src/services/base.token.service";
import GoogleAuthService from "@src/services/Auth/Google/google.service";
import { RetornoTokenDTo } from "@src/dto/userRetornoDTo";
import { ErroException } from "@src/exceptions/ErroException";
import { TokenDTo } from "@src/dto/retornoTokenDTo";
import PasswordService from "@src/services/Auth/API/password.service";
import { AccessTokenService } from "@src/services/Auth/Token/access-token.service";
import { AuthMiddleware } from "@src/middleware/auth";
import { SessionService } from "@src/services/Auth/API/session.service";

@Controller("auth")
@safeExecution
export class AuthController {
  constructor(
    private userService: UserService,
    private sessionService: SessionService,
    private accessTokenService: AccessTokenService
  ) {}

  @Post("api")
  public async authenticateApi(
    req: Request,
    res: Response<RetornoDTo>
  ): Promise<void> {
    const { api_key } = req.body;
    const admApiKey = config.get("App.adm-api-key");
    const employeeApiKey = config.get("App.api-key");
    var role = userRole.USER;
    switch (api_key) {
      case admApiKey:
        role = userRole.ADMIN;
        break;
      case employeeApiKey:
        role = userRole.EMPLOYEE;
        break;
      default:
        throw new FalhaException("Acesso não autorizado", 403);
    }
    const decodedToken: JwtToken = {
      sub: undefined,
      role,
    };
    const access_token = this.accessTokenService.create(decodedToken, "1d");
    const retorno = new RetornoDTo({
      code: 200,
      sucesso: true,
      dados: [access_token],
    });
    res.status(200).send(retorno);
  }

  @Post("login")
  public async login(req: Request, res: Response<RetornoDTo>): Promise<void> {
    const { user_email, user_password } = req.body;
    const user = await this.userService.getUserByParam(
      "user_email",
      user_email,
      {
        id: true,
        user_password: true,
        user_role: true,
        user_name: true,
        user_email: true,
        avatar_url: true,
      }
    );

    if (!user) {
      throw new FalhaException("Usuário não encontrado.", 401);
    }
    const comparePasswords = await PasswordService.comparePasswords(
      user_password,
      user.user_password ?? ""
    );
    if (!comparePasswords) {
      throw new FalhaException("Usuário não encontrado.", 401);
    }
    const decodedToken: JwtToken = {
      sub: user.id,
      role: userRole[user.user_role],
    };
    const access_token = this.accessTokenService.create(decodedToken);
    var refresh_token: TokenDTo | null = null;
    try {
      refresh_token = await this.sessionService.create(decodedToken, user, req);
    } catch (error) {
      if (!(error instanceof ErroException)) {
        throw error;
      }
    }
    if (refresh_token == null)
      throw new ErroException(
        "Ocorreu um erro interno ao realizar o login, erro ao gerar o token de acesso."
      );
    const { user_name, user_email: email, avatar_url } = user;
    const retorno = new RetornoDTo<RetornoTokenDTo>({
      code: 200,
      sucesso: true,
      dados: [
        {
          access_token,
          refresh_token,
          user: {
            user_email: email,
            user_name,
            avatar_url,
          },
        },
      ],
    });
    res.status(200).send(retorno);
  }

  @Post("refresh-token")
  public async refreshToken(req: Request, res: Response<RetornoDTo>) {
    const { token } = req.body;

    if (!token) {
      throw new FalhaException(
        "Não foi possivel atualizar suas credenciais de acesso, realize o login novamente."
      );
    }

    try {
      const { access_token, refresh_token } = await this.sessionService.refresh(
        token,
        req
      );
      const retorno = new RetornoDTo({
        code: 200,
        sucesso: true,
        dados: [
          {
            access_token,
            refresh_token,
          },
        ],
      });
      res.status(200).send(retorno);
    } catch (error) {
      if (error instanceof ErroException) {
        throw new ErroException(
          "Não foi possivel atualizar suas credenciais de acesso, realize o login novamente."
        );
      }
      throw error;
    }
  }

  @Post("validate-token")
  public async validateToken(req: Request, res: Response<RetornoDTo>) {
    const { token } = req.body;

    if (!token) {
      throw new FalhaException(
        "Não foi possivel validar sua sessão, realize o login novamente.",
        403
      );
    }

    try {
      this.accessTokenService.decode<JwtToken>(token);
      const retorno = new RetornoDTo({
        code: 200,
        sucesso: true,
        dados: [],
        mensagem: "token válido.",
      });
      res.status(200).send(retorno);
    } catch (err) {
      throw new FalhaException("Erro de autenticação", 401);
    }
  }

  @Delete("delete-all-sessions")
  public async edit(req: Request, res: Response<RetornoDTo>): Promise<void> {
    const idQuery = req.query.user_id;
    const token = this.accessTokenService.getToken(req);
    const { is } = AuthMiddleware.isTypeUser(req, userRole.ADMIN);
    let user_id: string | undefined;
    if (is) {
      if (!idQuery) {
        throw new FalhaException("Erro ao obter o usuário", 404);
      }
      user_id = idQuery.toString();
    } else {
      const { sub } = this.accessTokenService.decode<JwtToken>(token);
      if (sub != idQuery) {
        throw new FalhaException("Acesso não autorizado", 403);
      }
      user_id = sub;
    }

    if (!user_id) {
      throw new FalhaException("Erro ao obter o usuário", 404);
    }
    const success = await this.sessionService.deleteAllByUser(user_id);
    if (success) {
      const retorno = new RetornoDTo({
        code: 200,
        sucesso: true,
        mensagem: `Sessões do usuário ${user_id} deletadas com sucesso.`,
      });
      res.status(200).json(retorno);
    } else {
      const retorno = new RetornoDTo({
        code: 404,
        sucesso: false,
        mensagem: `Não foi possivel deletar as sessões do usuário: ${user_id.toString()}.`,
      });
      res.status(404).json(retorno);
    }
  }

  @Get("google/url")
  public async getUrlGoogle(req: Request, res: Response<RetornoDTo>) {
    const redirect = req.query.redirect;
    const url = await GoogleAuthService.getAuthUrl(
      typeof redirect === "string" ? redirect : null
    );
    const retorno = new RetornoDTo<string>({
      code: 201,
      sucesso: true,
      dados: [url],
    });
    res.status(200).send(retorno);
  }

  @Post("google")
  public async authGoogle(
    req: Request,
    res: Response<RetornoDTo<RetornoTokenDTo>>
  ) {
    const google_access_token = await GoogleAuthService.getAccessToken(
      req.body.code
    );
    console.log(google_access_token);
    const response = await GoogleAuthService.getUserData(google_access_token);
    const user = await this.userService.getUserByParam(
      "user_email",
      response.email,
      {
        id: true,
        user_role: true,
      }
    );

    if (!user) {
      if (response.email) {
        const retorno = new RetornoDTo<RetornoTokenDTo>({
          code: 200,
          sucesso: true,
          dados: [
            {
              user: {
                logged: false,
                user_email: response.email,
                user_name: response.name,
                avatar_url: response.picture,
              },
            },
          ],
        });
        res.status(200).send(retorno);
        return;
      }
      throw new FalhaException("Usuário não encontrado.", 400);
    }

    const decodedToken: JwtToken = {
      sub: user.id,
      role: userRole[user.user_role],
    };
    const access_token = this.accessTokenService.create(decodedToken);
    const refresh_token = await this.sessionService.create(
      decodedToken,
      user,
      req
    );
    const retorno = new RetornoDTo<RetornoTokenDTo>({
      code: 200,
      sucesso: true,
      dados: [
        {
          access_token,
          refresh_token,
          user: {
            logged: true,
            user_email: response.email,
            user_name: response.name,
            avatar_url: response.picture,
          },
        },
      ],
    });
    res.status(200).send(retorno);
  }
}
