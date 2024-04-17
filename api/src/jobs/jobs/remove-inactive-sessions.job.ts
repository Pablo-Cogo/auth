import { RefrershTokenService } from "@src/services/Auth/Token/refresh-token.service";
import { JwtToken } from "@src/services/base.token.service";
import { BaseJob } from "../base.job";
import { StatusJobEnum } from "@prisma/client";

interface ReturnRemoveSession {
  actives: number;
  inactives: number;
  failures: number;
  total: number;
}
class RemoveInactiveSessionsJob extends BaseJob {
  constructor(private refreshTokenService: RefrershTokenService) {
    super();
  }

  public async handle(): Promise<void> {
    const { actives, inactives, failures, total } = await this._exec();
    const message = `sessões ativas: ${actives}, sessões removidas: ${inactives}, falhas: ${failures}, total: ${total}`;
    if (failures > 0) this.save(message, StatusJobEnum.FAIL);
    else this.save(message, StatusJobEnum.SUCCESS);
  }

  private async _exec(): Promise<ReturnRemoveSession> {
    const sessionProps: ReturnRemoveSession = {
      actives: 0,
      inactives: 0,
      failures: 0,
      total: 0,
    };

    const sessions = await this._findAllSessions();
    sessionProps.total = sessions.length;

    for (const session of sessions) {
      try {
        const isValid = this._isValidToken(session.token);
        if (!isValid) {
          const count = await this._deleteSession(session.token);
          if (count > 0) {
            sessionProps.inactives += count;
          }
        } else {
          sessionProps.actives++;
        }
      } catch (error) {
        sessionProps.failures++;
      }
    }

    return sessionProps;
  }

  private async _findAllSessions() {
    const sessions = await this.client.session.findMany({
      select: {
        token: true,
      },
    });
    return sessions;
  }

  private _isValidToken(token: string) {
    try {
      this.refreshTokenService.decode<JwtToken>(token);
      return true;
    } catch {
      return false;
    }
  }

  private async _deleteSession(token: string) {
    const { count } = await this.client.session.deleteMany({
      where: { token },
    });
    return count;
  }
}

export { RemoveInactiveSessionsJob };
