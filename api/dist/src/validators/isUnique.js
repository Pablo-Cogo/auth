"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsUnique = void 0;
const class_validator_1 = require("class-validator");
function IsUnique(entity, validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: "isUnique",
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                async validate(value, args) {
                    const [existingEntity] = await entity.findMany({
                        where: { [propertyName]: value },
                    });
                    if (existingEntity) {
                        return false;
                    }
                    return true;
                },
                defaultMessage(args) {
                    return `${args.property} já está em uso, escolha outro.`;
                },
            },
        });
    };
}
exports.IsUnique = IsUnique;
//# sourceMappingURL=isUnique.js.map