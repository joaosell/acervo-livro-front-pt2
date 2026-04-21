import { useEffect, useState } from "react";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Modal,
  Row,
  Select,
  Table,
  Typography,
} from "antd";
import { CheckOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { emprestimoService } from "../../services/emprestimoService";
import type { IEmprestimo } from "../../types/Emprestimos";
import { usuarioService } from "../../services/usuarioService";
import { livroService } from "../../services/livroService";
import { exemplarService } from "../../services/exemplarService";
import type { IUsuarios } from "../../types/Usuarios";
import type { ILivros } from "../../types/Livros";
import type { IExemplares } from "../../types/Exemplares";
import dayjs from "dayjs";

function Emprestimos() {
  const [emprestimos, setEmprestimos] = useState<IEmprestimo[]>([]);
  const [usuarios, setUsuarios] = useState<IUsuarios[]>([]);
  const [livros, setLivros] = useState<ILivros[]>([]);
  const [exemplares, setExemplares] = useState<IExemplares[]>([]);
  const [modalAberta, setModalAberta] = useState(false);
  const [form] = Form.useForm();

  const carregar = () => emprestimoService.getAll().then(setEmprestimos);

  useEffect(() => {
    livroService.getAll().then(setLivros);
    usuarioService.getAll().then(setUsuarios);
    exemplarService.getAll().then(setExemplares);
    carregar();
  }, []);

  const criarEmprestimo = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        ...values,
        data_devolucao: values.data_devolucao.format("YYYY-MM-DD"),
        data_emprestimo: dayjs().format("YYYY-MM-DD"),
        ativo: true,
      };
      await emprestimoService.create(payload);
      carregar();
      setModalAberta(false);
      form.resetFields();
    } catch (e) {
      console.log(e);
    }
  };

  const columns = [
    {
      title: "Código de Patrimônio",
      dataIndex: "codigo_patrimonio",
      key: "codigo_patrimonio",
      render: (_: unknown, emprestimo: IEmprestimo) =>
        emprestimo.exemplar.codigo_patrimonio || "—",
    },
    {
      title: "Livro",
      key: "livro",
      render: (_: unknown, emprestimo: IEmprestimo) =>
        emprestimo.exemplar?.livro?.titulo || "—",
    },
    {
      title: "Usuário",
      key: "usuario",
      render: (_: unknown, emprestimo: IEmprestimo) =>
        emprestimo.usuario?.nome || "—",
    },

    {
      title: "Data do Empréstimo",
      dataIndex: "data_emprestimo",
      key: "data_emprestimo",
      render: (_: unknown, emprestimo: IEmprestimo) =>
        new Date(emprestimo.data_emprestimo).toLocaleDateString("pt-BR"),
    },
    {
      title: "Ação",
      key: "acao",
      render: (_: unknown, emprestimo: IEmprestimo) =>
        emprestimo.ativo ? (
          <Button
            type="primary"
            icon={<CheckOutlined />}
            onClick={() =>
              Modal.confirm({
                title: "Confirmar devolução",
                content: `Deseja confirmar a devolução do livro "${emprestimo.exemplar?.livro?.titulo}"?`,
                okText: "Confirmar",
                cancelText: "Cancelar",
                onOk: async () => {
                  await emprestimoService.devolver(emprestimo.id);
                  carregar();
                },
              })
            }
          >
            Devolver
          </Button>
        ) : (
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() =>
              Modal.confirm({
                title: "Remover empréstimo",
                content: `Deseja remover o empréstimo do livro "${emprestimo.exemplar?.livro?.titulo}"?`,
                okType: "danger",
                okText: "Remover",
                cancelText: "Cancelar",
                onOk: async () => {
                  await emprestimoService.remove(emprestimo.id);
                  carregar();
                },
              })
            }
          />
        ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Typography.Title>Empréstimos</Typography.Title>

      <Row
        justify="center"
        align="middle"
        style={{ marginBottom: 16, position: "relative" }}
      >
        <Col style={{ position: "absolute", right: 0 }}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setModalAberta(true)}
          >
            Novo Empréstimo
          </Button>
        </Col>
      </Row>

      <Table dataSource={emprestimos} columns={columns} rowKey="id" />

      <Modal
        title="Novo Empréstimo"
        open={modalAberta}
        onOk={criarEmprestimo}
        onCancel={() => {
          form.resetFields();
          setModalAberta(false);
        }}
        okText="Criar"
        cancelText="Cancelar"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="exemplar_id"
            label="Exemplar"
            rules={[{ required: true, message: "Selecione o exemplar" }]}
          >
            <Select
              placeholder="Selecione o exemplar"
              options={exemplares.map((a: IExemplares) => ({
                value: a.id,
                label: a.livro.titulo,
              }))}
            />
          </Form.Item>

          <Form.Item
            name="usuario_id"
            label="Usuário"
            rules={[{ required: true, message: "Selecione o usuário" }]}
          >
            <Select
              placeholder="Selecione o usuário"
              options={usuarios.map((a: IUsuarios) => ({
                value: a.id,
                label: a.nome,
              }))}
            />
          </Form.Item>

          <Form.Item
            name="data_devolucao"
            label="Data de Devolução"
            rules={[{ required: true, message: "Informe a data de devolução" }]}
          >
            <DatePicker
              style={{ width: "100%" }}
              placeholder="Selecione a data"
              format="DD/MM/YYYY"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default Emprestimos;
