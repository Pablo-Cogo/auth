type Retorno<T = any> = {
  sucesso: boolean;
  dados?: Array<T>;
  mensagem?: string | null;
  code?: number;
};

export class RetornoDTo<T = any> {
  sucesso: boolean;
  dados: Array<T> | [];
  mensagem: string | null;
  code: number;

  constructor(config: Retorno<T>) {
    this.code = config.code !== undefined ? config.code : 500;
    this.sucesso = config.sucesso !== undefined ? config.sucesso : false;
    this.dados = config.dados !== undefined ? config.dados : [];
    this.mensagem = config.mensagem !== undefined ? config.mensagem : null;
  }
}
