import type { ILivros } from "./livros";

export interface IExemplares {
  id: number;
  livro: ILivros;
  codigo_patrimonio: number;
  ano_publicacao: number;
  emprestimos: [];
}
