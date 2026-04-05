import { api } from "./api";

export const usuarioService = {
  login: (email: string, senha: string) =>
    api.post("/usuarios/login", { email, senha }),

  getAll: () => api.get("/usuarios"),
};
