/**
 * utilizado quando o erro é responsabilidade do sistema
 * sucesso: false
 */
export class ErroException extends Error {
  codigo: number;

  constructor(mensagem: string, codigo?: number) {
    super(mensagem);
    this.codigo = codigo ?? 500;
    Object.setPrototypeOf(this, ErroException.prototype);
  }
}
