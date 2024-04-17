import { UserModel } from "@src/model/user.model";
import { validarErrosEntidade } from "@src/validators/entities";
import { ValidationError, validate, validateOrReject } from "class-validator";
import { Prisma, User } from "@prisma/client";
import { plainToClass } from "class-transformer";
import { ErroException } from "@src/exceptions/ErroException";
import { FalhaException } from "@src/exceptions/FalhaException";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { BaseService } from "../base.service";
import PasswordService from "../Auth/API/password.service";

export default class UserService extends BaseService {
  constructor() {
    super();
  }
  public async createUser(user: UserModel): Promise<User> {
    const userData = plainToClass(UserModel, user);
    const errors = await validate(userData);
    validarErrosEntidade(errors);
    const user_password = await PasswordService.hashPassword(
      userData.user_password
    );
    const userCreated = await this.client.user.create({
      data: { ...userData, user_password },
    });
    return userCreated;
  }

  public async getUserByParam<
    K extends keyof UserModel,
    T extends Prisma.UserSelect<DefaultArgs>
  >(param: K, value: UserModel[K], select: T) {
    const user = this.client.user.findFirst({
      select,
      where: {
        [param]: value,
      },
    });
    return user;
  }

  public async editUser(id: string, updatedUserData: UserModel): Promise<User> {
    const userData = plainToClass(UserModel, updatedUserData);
    const updatedData: Partial<UserModel> = Object.entries(updatedUserData)
      .filter(([_, value]) => value !== null && value !== undefined)
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

    const errors = await validate(userData, {
      skipMissingProperties: true,
      validationError: { target: false },
      forbidUnknownValues: true,
    });
    validarErrosEntidade(errors);

    if (Object.keys(updatedData).length === 0) {
      throw new ErroException("Nenhum dado encontrado.", 400);
    }

    try {
      let userUpdated: User | undefined;
      if (updatedData.user_password) {
        const user_password = await PasswordService.hashPassword(
          userData.user_password
        );
        userUpdated = await this.client.user.update({
          where: { id },
          data: { ...updatedData, user_password },
        });
      } else {
        userUpdated = await this.client.user.update({
          where: { id },
          data: updatedData,
        });
      }
      return userUpdated;
    } catch (error) {
      if (error instanceof Error) {
        if (error.name.includes("PrismaClientValidationError")) {
          throw new FalhaException(
            "Erro na validação dos campos do usuário.",
            400
          );
        }
      }
      throw new ErroException("Erro ao atualizar o usuário.", 400);
    }
  }

  public async deleteUser(id: string): Promise<User> {
    try {
      await this.client.user.findFirstOrThrow({
        where: { id },
      });
    } catch (error) {
      throw new FalhaException("Erro ao encontrar o usuário");
    }
    return this.client.user.delete({
      where: { id },
    });
  }

  public async getAllUsers<T extends Prisma.UserSelect<DefaultArgs>>(
    paramsSelect: T
  ) {
    const users = await this.client.user.findMany({
      select: paramsSelect ?? null,
    });
    return users;
  }
}
