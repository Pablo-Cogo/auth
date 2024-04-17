"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const entities_1 = require("@src/validators/entities");
const class_validator_1 = require("class-validator");
const base_service_1 = require("./base.service");
class UserService extends base_service_1.BaseService {
    constructor() {
        super();
    }
    async createUser(user) {
        const errors = await (0, class_validator_1.validate)(user);
        (0, entities_1.validarErrosEntidade)(errors);
        const userCreated = await this.client.user.create({
            data: user,
        });
        return userCreated;
    }
}
exports.default = UserService;
//# sourceMappingURL=user.service.js.map