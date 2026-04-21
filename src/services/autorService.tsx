import { api } from "./api";

export const autorService = {
  getAll: () => api.get("/autores"),
  create: (body: { nome: string; nacionalidade: string }) =>
    api.post("/autores", body),
  update: (id: number, body: { nome: string; nacionalidade: string }) =>
    api.patch(`/autores/${id}`, body),
  remove: (id: number) => api.delete(`/autores/${id}`),
};
