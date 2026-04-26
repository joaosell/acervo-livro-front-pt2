import type { IAutores } from "../types/autores";
import type { ICategoria } from "../types/Categorias";

import { api } from "./api";

export const livroService = {
  create: (body: {
    titulo: string;
    isbn: number;
    autores: IAutores[];
    categorias: ICategoria[];
  }) => api.post("/livros", body),
  update: (
    id: number,
    body: {
      titulo: string;
      isbn: number;
      autores: IAutores[];
      categorias: ICategoria[];
    },
  ) => api.patch(`/livros/${id}`, body),
  remove: (id: number) => api.delete(`/livros/${id}`),
  getAll: () => api.get("/livros"),
  buscarAvancado: (params: {
    categoria_id?: number;
    autor_id?: number;
    onlyDisponiveis?: boolean;
  }) => api.get("/livros/busca", { params }),
};
