import { api } from "./api";

export const editoraService = {
  getAll: () => api.get("/editoras"),
  create: (body: { nome: string; cidade: string }) =>
    api.post("/editoras", body),
  update: (id: number, body: { nome: string; cidade: string }) =>
    api.patch(`/editoras/${id}`, body),
  remove: (id: number) => api.delete(`/editoras/${id}`),
};
