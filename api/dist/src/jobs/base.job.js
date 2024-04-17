"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseJob = void 0;
const prisma_client_1 = require("@src/database/prisma.client");
class BaseJob {
    constructor() {
        this.client = prisma_client_1.client;
        this.classname = this.constructor.name;
    }
    getClassName() {
        return this.classname;
    }
    async clear() {
        const thirdyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        await this.client.job.deleteMany({
            where: {
                AND: [
                    { name: this.classname },
                    {
                        executed_at: {
                            lt: thirdyDaysAgo,
                        },
                    },
                ],
            },
        });
    }
    async save(message, status) {
        const jobCreated = await this.client.job.create({
            data: {
                name: this.classname,
                message,
                status,
            },
        });
        return jobCreated;
    }
}
exports.BaseJob = BaseJob;
//# sourceMappingURL=base.job.js.map