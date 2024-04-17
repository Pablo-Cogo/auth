"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseService = void 0;
const prisma_client_1 = require("@src/database/prisma.client");
class BaseService {
    constructor() {
        this.client = prisma_client_1.client;
    }
}
exports.BaseService = BaseService;
//# sourceMappingURL=base.service.js.map