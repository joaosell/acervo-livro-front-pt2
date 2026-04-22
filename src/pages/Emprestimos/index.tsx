import { useEffect, useState } from "react";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Modal,
  Row,
  Segmented,
  Select,
  Table,
  Typography,
} from "antd";
import { CheckOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { emprestimoService } from "../../services/emprestimoService";
import type { IEmprestimo } from "../../types/Emprestimos";
import { usuarioService } from "../../services/usuarioService";
import { exemplarService } from "../../services/exemplarService";
import type { IUsuarios } from "../../types/Usuarios";
import type { IExemplares } from "../../types/Exemplares";
import dayjs from "dayjs";

function Emprestimos() {
  const [emprestimos, setEmprestimos] = useState<IEmprestimo[]>([]);
  const [exemplarSelecionado, setExemplarSelecionado] =
    useState<IExemplares | null>(null);
  const [usuarios, setUsuarios] = useState<IUsuarios[]>([]);
  const [exemplares, setExemplares] = useState<IExemplares[]>([]);
  const [modalAberta, setModalAberta] = useState(false);
  const [form] = Form.useForm();
  const [filtroAtivo, setFiltroAtivo] = useState<
    "todos" | "ativos" | "inativos"
  >("todos");

  const emprestimosFiltrados = emprestimos.filter((e) => {
    if (filtroAtivo === "ativos") return e.ativo;
    if (filtroAtivo === "inativos") return !e.ativo;
    return true;
  });

  const carregar = () => emprestimoService.getAll().then(setEmprestimos);

  useEffect(() => {
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
      filters: [
        ...new Map(
          emprestimos.map((e) => [
            e.exemplar?.livro?.titulo,
            {
              text: e.exemplar?.livro?.titulo,
              value: e.exemplar?.livro?.titulo,
            },
          ]),
        ).values(),
      ],
      onFilter: (value: unknown, emprestimo: IEmprestimo) =>
        emprestimo.exemplar?.livro?.titulo === value,
      render: (_: unknown, emprestimo: IEmprestimo) =>
        emprestimo.exemplar?.livro?.titulo || "—",
    },
    {
      title: "Usuário",
      key: "usuario",
      filters: [
        ...new Map(
          emprestimos.map((e) => [
            e.usuario?.nome,
            { text: e.usuario?.nome, value: e.usuario?.nome },
          ]),
        ).values(),
      ],
      onFilter: (value: unknown, emprestimo: IEmprestimo) =>
        emprestimo.usuario?.nome === value,
      render: (_: unknown, emprestimo: IEmprestimo) =>
        emprestimo.usuario?.nome || "—",
    },

    {
      title: "Data do Empréstimo",
      dataIndex: "data_emprestimo",
      key: "data_emprestimo",
      sorter: (a: IEmprestimo, b: IEmprestimo) =>
        new Date(a.data_emprestimo).getTime() -
        new Date(b.data_emprestimo).getTime(),
      render: (_: unknown, emprestimo: IEmprestimo) =>
        new Date(emprestimo.data_emprestimo).toLocaleDateString("pt-BR"),
    },
    {
      title: "Data de Devolução",
      dataIndex: "data_devolucao",
      key: "data_devolucao",
      sorter: (a: IEmprestimo, b: IEmprestimo) =>
        new Date(a.data_devolucao).getTime() -
        new Date(b.data_devolucao).getTime(),
      render: (_: unknown, emprestimo: IEmprestimo) =>
        new Date(emprestimo.data_devolucao).toLocaleDateString("pt-BR"),
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

      <Segmented
        value={filtroAtivo}
        onChange={(value) =>
          setFiltroAtivo(value as "todos" | "ativos" | "inativos")
        }
        options={[
          { label: "Todos", value: "todos" },
          { label: "Ativos", value: "ativos" },
          { label: "Inativos", value: "inativos" },
        ]}
        style={{ marginBottom: 16 }}
      />

      <Table dataSource={emprestimosFiltrados} columns={columns} rowKey="id" />

      <Modal
        title="Novo Empréstimo"
        open={modalAberta}
        onOk={criarEmprestimo}
        onCancel={() => {
          form.resetFields();
          setModalAberta(false);
          setExemplarSelecionado(null);
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
              onChange={(id) => {
                const encontrado = exemplares.find((e) => e.id === id) || null;
                setExemplarSelecionado(encontrado);
              }}
            />
          </Form.Item>
          {exemplarSelecionado && (
            <div
              style={{
                marginBottom: 16,
                padding: 12,
                background: "#f5f5f5",
                borderRadius: 6,
              }}
            >
              <Typography.Text strong>Editora: </Typography.Text>
              <Typography.Text>
                {exemplarSelecionado.editora?.nome || "—"}
              </Typography.Text>
              <br />
              <Typography.Text strong>Código de Patrimônio: </Typography.Text>
              <Typography.Text>
                {exemplarSelecionado.codigo_patrimonio || "—"}
              </Typography.Text>
              <br />
              <Typography.Text strong>Autor(es): </Typography.Text>
              <Typography.Text>
                {exemplarSelecionado.livro?.autor
                  ?.map((a) => a.nome)
                  .join(", ") || "—"}
              </Typography.Text>
            </div>
          )}
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
              disabledDate={(current) =>
                current && current < dayjs().startOf("day")
              }
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default Emprestimos;
