import type { IExemplares } from "./Exemplares";
import type { IUsuarios } from "./Usuarios";

export interface IEmprestimo {
  id: number;
  exemplar: IExemplares;
  usuario: IUsuarios;
  data_emprestimo: string;
  data_devolucao: string;
  ativo: boolean;
}
