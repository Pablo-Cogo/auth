"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RetornoDTo = void 0;
class RetornoDTo {
    constructor(config) {
        this.code = config.code !== undefined ? config.code : 500;
        this.sucesso = config.sucesso !== undefined ? config.sucesso : false;
        this.dados = config.dados !== undefined ? config.dados : [];
        this.mensagem = config.mensagem !== undefined ? config.mensagem : null;
    }
}
exports.RetornoDTo = RetornoDTo;
//# sourceMappingURL=retornoDTo.js.map