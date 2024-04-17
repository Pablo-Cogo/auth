"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoveInactiveSessionsJob = void 0;
const base_job_1 = require("./base.job");
class RemoveInactiveSessionsJob extends base_job_1.BaseJob {
    constructor(refreshTokenService) {
        super();
        this.refreshTokenService = refreshTokenService;
    }
    async handle() {
        const sessions = await this._findAllSessions();
        sessions.forEach((session) => {
            const isValid = this._isValidToken(session.token);
            if (!isValid)
                this._deleteSession(session.token);
        });
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
        catch (error) {
            return false;
        }
    }
    async _deleteSession(token) {
        await this.client.session.deleteMany({
            where: { token },
        });
    }
}
exports.RemoveInactiveSessionsJob = RemoveInactiveSessionsJob;
//# sourceMappingURL=remove-inactive-sessions.job.js.map