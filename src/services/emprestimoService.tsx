import { api } from "./api";

export const emprestimoService = {
  getAll: () => api.get("/emprestimos"),
  create: (body: {
    exemplar_id: number;
    usuario_id: number;
    data_emprestimo: string;
    data_devolucao: string;
  }) => api.post("/emprestimos", body),
  remove: (id: number) => api.delete(`/emprestimos/${id}`),
  devolver: (id: number) => api.patch(`/emprestimos/${id}/devolucao`, {}),
};
