"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Enum = void 0;
class Enum {
    static getKeyByValue(enumObj, value) {
        for (const key in enumObj) {
            if (enumObj[key] == value) {
                return key;
            }
        }
        return undefined;
    }
}
exports.Enum = Enum;
//# sourceMappingURL=enum.converter.js.map