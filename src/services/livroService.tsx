import { api } from "./api";

export const livroService = {
  create: (body: {
    titulo: string;
    isbn: number;
    editora: string;
    autores: string[];
    categorias: string[];
  }) => api.post("/livros", body),
  update: (
    id: number,
    body: {
      titulo: string;
      isbn: number;
      editora: string;
      autores: string[];
      categorias: string[];
    },
  ) => api.patch(`/livros/${id}`, body),
  remove: (id: number) => api.delete(`/livros/${id}`),
  getAll: () => api.get("/livros"),
  buscarAvancado: (params: {
    categorias?: number;
    autores?: number;
    onlyDisponiveis?: boolean;
  }) => api.get("/livros/busca", { params }),
};
