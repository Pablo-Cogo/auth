"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validarErrosEntidade = void 0;
const ErroException_1 = require("@src/exceptions/ErroException");
function validarErrosEntidade(errors) {
    if (errors.length > 0) {
        const finalMessage = ["Campos inválidos:"];
        errors.forEach((err) => {
            var keys = Object.keys(err.constraints || {});
            keys.forEach((field) => {
                const constraints = err.constraints || {};
                const fieldErrors = constraints[field] || [];
                if (Array.isArray(fieldErrors)) {
                    fieldErrors.forEach((errorMessage) => {
                        finalMessage.push(`${errorMessage}`);
                    });
                }
                else {
                    finalMessage.push(`${fieldErrors}`);
                }
            });
        });
        throw new ErroException_1.ErroException(finalMessage.join(" "), 422);
    }
}
exports.validarErrosEntidade = validarErrosEntidade;
//# sourceMappingURL=entities.js.map