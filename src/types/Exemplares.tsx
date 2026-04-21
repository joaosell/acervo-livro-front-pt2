import type { IEditoras } from "./Editoras";
import type { ILivros } from "./Livros";

export interface IExemplares {
  id: number;
  livro: ILivros;
  codigo_patrimonio: number;
  ano_publicacao: number;
  emprestimos: [];
  editora: IEditoras;
}
