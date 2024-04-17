import { User } from "@prisma/client";
import { Request } from "express";
import { BaseService } from "@src/services/base.service";
import HelperService from "@src/services/helpers";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { validarErrosEntidade } from "@src/validators/entities";
import { TokenDTo } from "@src/dto/retornoTokenDTo";
import { ErroException } from "@src/exceptions/ErroException";
import { FalhaException } from "@src/exceptions/FalhaException";
import { JwtToken } from "@src/services/base.token.service";
import { SessionModel } from "@src/model/session.model";
import dayjs from "dayjs";
import { AccessTokenService } from "../Token/access-token.service";
import { RefrershTokenService } from "../Token/refresh-token.service";
import ClientService from "./client.service";

class SessionService extends BaseService {
  constructor(
    private accessTokenService: AccessTokenService,
    private refreshTokenService: RefrershTokenService
  ) {
    super();
  }

  public async create(
    data: string | Record<string, any>,
    user: Partial<User>,
    req: Request
  ): Promise<TokenDTo> {
    const refresh_token = this.refreshTokenService.create(data);
    const dateConverted = HelperService.convertStringToDaysJs(
      refresh_token.expires_in
    );
    const sessionData = this._mapSessionData(
      refresh_token.token,
      user,
      dateConverted,
      req
    );
    const sessionCreated = await this._createSessionData(sessionData);

    return {
      token: sessionCreated.token,
      expires_in: dateConverted.format("DD/MM/YYYY HH:mm:ss"),
    };
  }

  private _mapSessionData(
    token: string,
    user: Partial<User>,
    dateConverted: dayjs.Dayjs,
    req: Request
  ) {
    const { ip_address, country, city, device } = this._getInfosClient(req);
    return plainToClass(SessionModel, {
      ip_address,
      country,
      city,
      token,
      device,
      expires_in: dateConverted.unix(),
      user: {
        connect: user,
      },
    });
  }

  private _getInfosClient(req: Request) {
    const ip_address = ClientService.getIpAddress(req);
    const { country, city } = ClientService.getLocationByIp(ip_address);
    const device = ClientService.getBrowserType(req);
    return { ip_address, country, city, device };
  }

  private async _createSessionData(sessionData: SessionModel) {
    await this._validateSessionData(sessionData);
    return await this.client.session.create({
      data: sessionData,
    });
  }

  private async _validateSessionData(sessionData: SessionModel) {
    try {
      const errors = await validate(sessionData);
      validarErrosEntidade(errors);
      const idUser = sessionData.user.connect?.id;
      if (!idUser) {
        throw new ErroException("Erro interno: erro ao encontrar o usuário.");
      }
    } catch (error) {
      if (!(error instanceof ErroException)) {
        throw error;
      }
      throw new ErroException(
        "Ocorreu um erro ao validar o token de acesso, realize o login novamente."
      );
    }
  }

  public async refresh(token: string, req: Request) {
    const foundSession = await this._findSession(token);
    if (!foundSession) {
      throw new ErroException(
        "Ocorreu um erro ao obter as credenciais de acesso, realize o login novamente."
      );
    }

    const { sub, role } = this.refreshTokenService.decode<JwtToken>(token);
    if (!sub) throw new FalhaException("Acesso não autorizado", 403);
    await this._deleteSession(foundSession.id);

    this._compareOldAndNewSession(foundSession, req);
    const refresh_token = await this._createNewSession({ sub, role }, req);
    const access_token = this.accessTokenService.create({ sub, role });

    return { access_token, refresh_token };
  }

  private async _findSession(token: string) {
    return await this.client.session.findFirst({
      where: {
        token,
      },
    });
  }

  private async _deleteSession(id: string) {
    await this.client.session.deleteMany({
      where: { id },
    });
  }

  private _compareOldAndNewSession(
    oldSession: Partial<SessionModel>,
    req: Request
  ) {
    const { ip_address, country, city, device } = this._getInfosClient(req);

    const isSameIp = oldSession.ip_address === ip_address;
    const isSameLocation =
      oldSession.country === country && oldSession.city === city;
    const isSameDevice = oldSession.device === device;

    if (!isSameIp || !isSameLocation || !isSameDevice) {
      throw new FalhaException(
        "Ocorreu um erro ao validar as credenciais de acesso, realize o login novamente."
      );
    }
  }

  private _createNewSession(oldToken: JwtToken, req: Request) {
    return this.create(
      oldToken,
      {
        id: oldToken.sub,
      },
      req
    );
  }

  public async deleteAllByUser(user_id: string): Promise<boolean> {
    try {
      await this._findAndDeleteSession(user_id);
      return true;
    } catch (error) {
      return false;
    }
  }

  private async _findAndDeleteSession(user_id: string) {
    await this.client.session.findFirstOrThrow({
      where: { user_id },
    });
    await this._deleteSessionByUser(user_id);
  }

  private async _deleteSessionByUser(user_id: string) {
    await this.client.session.deleteMany({
      where: { user_id },
    });
  }
}

export { SessionService };
