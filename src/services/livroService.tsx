import { api } from "./api";

export const livroService = {
  getAll: () => api.get("/livros"),
};
