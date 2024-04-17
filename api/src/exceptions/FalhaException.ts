/**
 * utilizado quando o erro é responsabilidade do cliente
 * sucesso: true
 */
export class FalhaException extends Error {
  codigo: number;

  constructor(mensagem: string, codigo?: number) {
    super(mensagem);
    this.codigo = codigo ?? 500;
    Object.setPrototypeOf(this, FalhaException.prototype);
  }
}
