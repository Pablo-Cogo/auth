"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErroException = void 0;
class ErroException extends Error {
    constructor(mensagem, codigo) {
        super(mensagem);
        this.codigo = codigo !== null && codigo !== void 0 ? codigo : 500;
        Object.setPrototypeOf(this, ErroException.prototype);
    }
}
exports.ErroException = ErroException;
//# sourceMappingURL=ErroException.js.map