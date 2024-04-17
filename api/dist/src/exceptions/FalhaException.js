"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FalhaException = void 0;
class FalhaException extends Error {
    constructor(mensagem, codigo) {
        super(mensagem);
        this.codigo = codigo !== null && codigo !== void 0 ? codigo : 500;
        Object.setPrototypeOf(this, FalhaException.prototype);
    }
}
exports.FalhaException = FalhaException;
//# sourceMappingURL=FalhaException.js.map