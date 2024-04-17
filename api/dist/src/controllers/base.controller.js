"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseController = void 0;
const prisma_client_1 = require("@src/database/prisma.client");
class BaseController {
    constructor() {
        this._client = prisma_client_1.client;
    }
}
exports.BaseController = BaseController;
//# sourceMappingURL=base.controller.js.map