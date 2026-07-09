import type { IAutores } from "./autores";
import type { ICategoria } from "./Categorias";
import type { IEditoras } from "./Editoras";

export interface ILivros {
  id: number;
  titulo: string;
  isbn: string;
  ano_publicacao: number;
  editora: IEditoras;
  autores: IAutores[];
  categorias: ICategoria[];
}
