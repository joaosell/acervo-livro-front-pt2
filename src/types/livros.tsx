import type { IAutores } from "./autores";
import type { ICategoria } from "./Categorias";

export interface ILivros {
  id: number;
  titulo: string;
  isbn: string;
  ano_publicacao: number;
  editora: string;
  autor: IAutores[];
  categoria: ICategoria[];
}
