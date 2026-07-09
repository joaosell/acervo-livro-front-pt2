import { api } from "./api";

export const emprestimoService = {
  getAll: () => api.get("/emprestimos"),
  create: (body: {
    exemplar: string;
    usuario: string;
    data_emprestimo: string;
    data_devolucao: string;
  }) => api.post("/emprestimos", body),
  remove: (id: number) => api.delete(`/emprestimos/${id}`),
  devolver: (id: number) => api.patch(`/emprestimos/${id}/devolucao`, {}),
  buscarAvancado: (params: {
    livro?: number;
    usuario?: number;
    exemplar?: number;
    data_inicio?: string;
    data_fim?: string;
    ativo?: boolean;
  }) => api.get("/emprestimos/busca", { params }),
};
