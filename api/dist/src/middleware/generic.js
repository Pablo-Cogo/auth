"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.safeExecutionFunction = exports.safeExecution = void 0;
const retornoDTo_1 = require("@src/dto/retornoDTo");
const ErroException_1 = require("@src/exceptions/ErroException");
const FalhaException_1 = require("@src/exceptions/FalhaException");
const handleErroException = (error, retorno) => {
    retorno.code = error.codigo;
    retorno.mensagem = error.message;
};
const handleFalhaException = (error, retorno) => {
    retorno.sucesso = true;
    retorno.code = error.codigo;
    retorno.mensagem = error.message;
};
const handleGenericError = (error, retorno) => {
    console.log(error.name);
    switch (error.name) {
        case "TokenExpiredError":
            retorno.mensagem = "Sua sessão expirou!";
            retorno.code = 440;
            break;
        case "JsonWebTokenError":
            retorno.mensagem = "Acesso não autorizado";
            retorno.code = 403;
            break;
        default:
            handleUnknowError(retorno);
    }
};
const handleUnknowError = (retorno) => {
    retorno.mensagem =
        "Ocorreu um erro interno, se o problema persistir contate o suporte.";
};
function safeExecution(target) {
    const originalMethods = Object.getOwnPropertyNames(target.prototype).filter((methodName) => methodName !== "constructor");
    originalMethods.forEach((methodName) => {
        const originalMethod = target.prototype[methodName];
        if (typeof originalMethod === "function") {
            target.prototype[methodName] = async function (req, res) {
                try {
                    await originalMethod.call(this, req, res);
                }
                catch (error) {
                    console.log(error);
                    var retorno = new retornoDTo_1.RetornoDTo({ sucesso: false });
                    if (error instanceof ErroException_1.ErroException) {
                        handleErroException(error, retorno);
                    }
                    else if (error instanceof FalhaException_1.FalhaException) {
                        handleFalhaException(error, retorno);
                    }
                    else if (error instanceof Error) {
                        handleGenericError(error, retorno);
                    }
                    else {
                        handleUnknowError(retorno);
                    }
                    res.status(retorno.code).send(retorno);
                }
            };
        }
    });
    return target;
}
exports.safeExecution = safeExecution;
function safeExecutionFunction(target, methodName, descriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = async function (req, res, next) {
        try {
            await originalMethod.call(this, req, res, next);
        }
        catch (error) {
            console.log(error);
            var retorno = new retornoDTo_1.RetornoDTo({ sucesso: false });
            if (error instanceof ErroException_1.ErroException) {
                handleErroException(error, retorno);
            }
            else if (error instanceof FalhaException_1.FalhaException) {
                handleFalhaException(error, retorno);
            }
            else if (error instanceof Error) {
                handleGenericError(error, retorno);
            }
            else {
                handleUnknowError(retorno);
            }
            res.status(retorno.code).send(retorno);
        }
    };
    return descriptor;
}
exports.safeExecutionFunction = safeExecutionFunction;
//# sourceMappingURL=generic.js.map