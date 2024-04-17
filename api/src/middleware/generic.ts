import { RetornoDTo } from "@src/dto/retornoDTo";
import { ErroException } from "@src/exceptions/ErroException";
import { FalhaException } from "@src/exceptions/FalhaException";
import { NextFunction, Request, Response } from "express";

const handleErroException = (error: ErroException, retorno: RetornoDTo) => {
  retorno.code = error.codigo;
  retorno.mensagem = error.message;
};

const handleFalhaException = (error: FalhaException, retorno: RetornoDTo) => {
  retorno.sucesso = true;
  retorno.code = error.codigo;
  retorno.mensagem = error.message;
};

const handleGenericError = (error: Error, retorno: RetornoDTo) => {
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

const handleUnknowError = (retorno: RetornoDTo) => {
  retorno.mensagem =
    "Ocorreu um erro interno, se o problema persistir contate o suporte.";
};

export function safeExecution(target: any): any {
  const originalMethods = Object.getOwnPropertyNames(target.prototype).filter(
    (methodName) => methodName !== "constructor"
  );

  originalMethods.forEach((methodName) => {
    const originalMethod = target.prototype[methodName];

    if (typeof originalMethod === "function") {
      target.prototype[methodName] = async function (
        req: Request,
        res: Response<RetornoDTo>
      ): Promise<void> {
        try {
          await originalMethod.call(this, req, res);
        } catch (error) {
          console.log(error);
          var retorno = new RetornoDTo({ sucesso: false });
          if (error instanceof ErroException) {
            handleErroException(error, retorno);
          } else if (error instanceof FalhaException) {
            handleFalhaException(error, retorno);
          } else if (error instanceof Error) {
            handleGenericError(error, retorno);
          } else {
            handleUnknowError(retorno);
          }
          res.status(retorno.code).send(retorno);
        }
      };
    }
  });

  return target;
}

export function safeExecutionFunction(
  target: any,
  methodName: string,
  descriptor: PropertyDescriptor
): PropertyDescriptor {
  const originalMethod = descriptor.value;

  descriptor.value = async function (
    req: Request,
    res: Response<RetornoDTo>,
    next: NextFunction
  ): Promise<void> {
    try {
      await originalMethod.call(this, req, res, next);
    } catch (error) {
      console.log(error);
      var retorno = new RetornoDTo({ sucesso: false });
      if (error instanceof ErroException) {
        handleErroException(error, retorno);
      } else if (error instanceof FalhaException) {
        handleFalhaException(error, retorno);
      } else if (error instanceof Error) {
        handleGenericError(error, retorno);
      } else {
        handleUnknowError(retorno);
      }
      res.status(retorno.code).send(retorno);
    }
  };

  return descriptor;
}
