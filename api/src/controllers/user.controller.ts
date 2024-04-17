import {
  Controller,
  Delete,
  Get,
  Middleware,
  Post,
  Put,
} from "@overnightjs/core";
import { Request, Response } from "express";
import { safeExecution } from "@src/middleware/generic";
import { CrudInterface } from "@src/interfaces/crudInterface";
import { RetornoDTo } from "@src/dto/retornoDTo";
import { userRole } from "@src/enums/user_role";
import { FalhaException } from "@src/exceptions/FalhaException";
import { AuthMiddleware } from "@src/middleware/auth";
import { User, UserRole } from "@prisma/client";
import { Enum } from "@src/converters/enum.converter";
import UserService from "@src/services/User/user.service";
import { JwtToken } from "@src/services/base.token.service";
import { AccessTokenService } from "@src/services/Auth/Token/access-token.service";

@Controller("user")
@safeExecution
export class UserController implements CrudInterface {
  constructor(
    private userService: UserService,
    private accessTokenService: AccessTokenService
  ) {}

  @Post("")
  public async create(req: Request, res: Response<RetornoDTo>): Promise<void> {
    const { is } = AuthMiddleware.isTypeUser(req, userRole.ADMIN);
    const role = Enum.getKeyByValue(userRole, req.body.user_role);

    if (!role || !isNaN(Number(role))) {
      throw new FalhaException(
        "Valor inválido para o campo [papel do usuário].",
        422
      );
    }

    if (!is && role != UserRole.USER) {
      throw new FalhaException("Acesso não autorizado", 403);
    }
    const user = await this.userService.createUser({
      ...req.body,
      user_role: role,
    });
    const retorno = new RetornoDTo<User>({
      code: 201,
      sucesso: true,
      dados: [user],
      mensagem: "Usuário criado com sucesso.",
    });
    res.status(retorno.code).json(retorno);
  }

  @Put("")
  public async edit(req: Request, res: Response<RetornoDTo>): Promise<void> {
    const idQuery = req.query.id;
    const token = this.accessTokenService.getToken(req);
    const { is } = AuthMiddleware.isTypeUser(req, userRole.ADMIN);
    let id: string | undefined;
    if (is) {
      if (!idQuery) {
        throw new FalhaException("Erro ao obter o usuário", 404);
      }
      id = idQuery.toString();
    } else {
      const { sub } = this.accessTokenService.decode<JwtToken>(token);
      if (sub != idQuery) {
        throw new FalhaException("Acesso não autorizado", 403);
      }
      id = sub;
    }

    if (!id) {
      throw new FalhaException("Erro ao obter o usuário", 404);
    }

    const existingUser = await this.userService.getUserByParam("id", id, {
      id: true,
      user_role: true,
    });

    if (!existingUser) {
      throw new FalhaException("Usuário não encontrado", 404);
    }

    const role = Enum.getKeyByValue(userRole, req.body.user_role);
    let user: User | undefined;

    if (role) {
      if (!is && role != existingUser.user_role) {
        throw new FalhaException("Acesso não autorizado", 403);
      }
      user = await this.userService.editUser(existingUser.id, {
        ...req.body,
        user_role: role,
      });
    } else {
      user = await this.userService.editUser(existingUser.id, req.body);
    }

    const retorno = new RetornoDTo<User>({
      code: 200,
      sucesso: true,
      dados: user ? [user] : [],
      mensagem: "Usuário alterado com sucesso.",
    });
    res.status(200).json(retorno);
  }

  @Delete("")
  @Middleware(AuthMiddleware.admin)
  public async delete(req: Request, res: Response<RetornoDTo>): Promise<void> {
    const { id } = req.query;

    if (!id) {
      throw new FalhaException("Erro ao obter o usuário", 404);
    }

    try {
      await this.userService.deleteUser(id.toString());
      const retorno = new RetornoDTo<User>({
        code: 200,
        sucesso: true,
        mensagem: `Usuário ${id} deletado com sucesso.`,
      });
      res.status(200).json(retorno);
    } catch (error) {
      const retorno = new RetornoDTo<User>({
        code: 404,
        sucesso: false,
        mensagem: `Erro ao deletar o usuário: ${id.toString()}.`,
      });
      res.status(404).json(retorno);
    }
  }

  @Get("list")
  @Middleware(AuthMiddleware.employee)
  public async getAll(_: Request, res: Response<RetornoDTo>): Promise<void> {
    const users = await this.userService.getAllUsers({
      id: true,
      user_name: true,
      user_email: true,
      avatar_url: true,
      updated_at: true,
    });
    const retorno = new RetornoDTo<Partial<User>>({
      code: 200,
      sucesso: true,
      dados: users,
    });
    res.status(200).json(retorno);
  }

  @Get("")
  @Middleware(AuthMiddleware.employee)
  public async getById(req: Request, res: Response<RetornoDTo>): Promise<void> {
    const { id } = req.query;
    if (!id) {
      throw new FalhaException("Erro ao obter o usuário", 404);
    }
    const user = await this.userService.getUserByParam("id", id.toString(), {
      id: true,
      user_name: true,
      user_email: true,
      avatar_url: true,
      updated_at: true,
    });
    const retorno = new RetornoDTo<Partial<User>>({
      code: 200,
      sucesso: false,
      dados: user ? [user] : [],
    });
    res.status(200).json(retorno);
  }
}
