"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoveInactiveSessionsJob = void 0;
const base_job_1 = require("../base.job");
const client_1 = require("@prisma/client");
class RemoveInactiveSessionsJob extends base_job_1.BaseJob {
    constructor(refreshTokenService) {
        super();
        this.refreshTokenService = refreshTokenService;
    }
    async handle() {
        const { actives, inactives, failures, total } = await this._exec();
        const message = `sessões ativas: ${actives}, sessões removidas: ${inactives}, falhas: ${failures}, total: ${total}`;
        if (failures > 0)
            this.save(message, client_1.StatusJobEnum.FAIL);
        else
            this.save(message, client_1.StatusJobEnum.SUCCESS);
    }
    async _exec() {
        const sessionProps = {
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
                }
                else {
                    sessionProps.actives++;
                }
            }
            catch (error) {
                sessionProps.failures++;
            }
        }
        return sessionProps;
    }
    async _findAllSessions() {
        const sessions = await this.client.session.findMany({
            select: {
                token: true,
            },
        });
        return sessions;
    }
    _isValidToken(token) {
        try {
            this.refreshTokenService.decode(token);
            return true;
        }
        catch {
            return false;
        }
    }
    async _deleteSession(token) {
        const { count } = await this.client.session.deleteMany({
            where: { token },
        });
        return count;
    }
}
exports.RemoveInactiveSessionsJob = RemoveInactiveSessionsJob;
//# sourceMappingURL=remove-inactive-sessions.job.js.map