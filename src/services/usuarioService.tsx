import { api } from "./api";

export const usuarioService = {
  // login: (email: string, senha: string) =>
  //   api.post("/usuarios/login", { email, senha }),
  create: (body: {
    nome: string;
    email: string;
    senha: string;
    tipo: number;
  }) => api.post("/usuarios", body),
  update: (
    id: number,
    body: { nome: string; email: string; senha: string; tipo: number },
  ) => api.patch(`/usuarios/${id}`, body),
  remove: (id: number) => api.delete(`/usuarios/${id}`),
  getAll: () => api.get("/usuarios"),
};
