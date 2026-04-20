import { api } from "./api";

export const categoriaService = {
  getAll: () => api.get("/categorias"),
  create: (body: { nome: string; descricao: string }) =>
    api.post("/categorias", body),
  update: (id: number, body: { nome: string }) =>
    api.patch(`/categorias/${id}`, body),
  remove: (id: number) => api.delete(`/categorias/${id}`),
};
