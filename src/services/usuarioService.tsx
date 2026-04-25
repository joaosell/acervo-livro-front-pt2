import { api } from "./api";

export const usuarioService = {
  create: (body: { nome: string; email: string }) =>
    api.post("/usuarios", body),
  update: (id: number, body: { nome: string; email: string }) =>
    api.patch(`/usuarios/${id}`, body),
  remove: (id: number) => api.delete(`/usuarios/${id}`),
  getAll: () => api.get("/usuarios"),
};
