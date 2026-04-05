import { api } from "./api";

export const exemplarService = {
  getAll: (livro_id: number) => api.get(`/exemplares/${livro_id}`),
};
