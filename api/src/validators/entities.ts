import { ErroException } from "@src/exceptions/ErroException";
import { ValidationError } from "class-validator";

export function validarErrosEntidade(errors: ValidationError[]) {
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
        } else {
          finalMessage.push(`${fieldErrors}`);
        }
      });
    });
    throw new ErroException(finalMessage.join(" "), 422);
  }
}
