import { api } from "./api";

export const exemplarService = {
  getAll: () => api.get(`/exemplares`),
  getAllDisponiveis: () => api.get("/exemplares/disponiveis"),
  getByExemplar: (id: number) => api.get(`/exemplares/${id}`),
  getByBook: (livro_id: number, onlyDisponiveis = false) =>
    api.get(`/exemplares/livro/${livro_id}?onlyDisponiveis=${onlyDisponiveis}`),
  create: (body: {
    id: number;
    livro_id: number;
    codigo_patrimonio: number;
    ano_publicacao: number;
    emprestimos: [];
  }) => api.post("/exemplares", body),
  update: (
    id: number,
    body: {
      id: number;
      livro_id: number;
      codigo_patrimonio: number;
      ano_publicacao: number;
      emprestimos: [];
    },
  ) => api.patch(`/exemplares/${id}`, body),
  remove: (id: number) => api.delete(`/exemplares/${id}`),
};
