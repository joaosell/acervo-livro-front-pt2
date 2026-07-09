import { useEffect, useState } from "react";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  Table,
  Typography,
  Select,
} from "antd";
import { livroService } from "../../services/livroService";
import { exemplarService } from "../../services/exemplarService";
import type { IExemplares } from "../../types/Exemplares";
import type { ILivros } from "../../types/livros";
import type { IUsuarios } from "../../types/Usuarios";
import { usuarioService } from "../../services/usuarioService";
import dayjs from "dayjs";
import { emprestimoService } from "../../services/emprestimoService";

function PaginaInicial() {
  const [livros, setLivros] = useState<ILivros[]>([]);
  const [usuarios, setUsuarios] = useState<IUsuarios[]>([]);
  const [exemplares, setExemplares] = useState<IExemplares[]>([]);
  const [busca, setBusca] = useState("");
  const [openExemplaresModal, setOpenExemplaresModal] = useState(false);
  const [tituloDoLivro, setTituloDoLivro] = useState("");
  const [exemplarSelecionado, setExemplarSelecionado] = useState<number | null>(
    null,
  );
  const [form] = Form.useForm();

  useEffect(() => {
    livroService.getAll().then(setLivros);
    usuarioService.getAll().then(setUsuarios);
  }, []);

  const criarEmprestimo = async (exemplar_id: number) => {
    try {
      const values = await form.validateFields();
      const payload = {
        ...values,
        data_devolucao: values.data_devolucao.format("YYYY-MM-DD"),
        data_emprestimo: dayjs().format("YYYY-MM-DD"),
        ativo: true,
        exemplar: exemplar_id,
      };
      await emprestimoService.create(payload);
      setOpenExemplaresModal(false);
      setExemplarSelecionado(null);
      form.resetFields();
    } catch (e) {
      console.log(e);
    }
  };

  async function handleOpenExemplaresModal(livro_id: number) {
    try {
      const data = await exemplarService.getByBook(livro_id, true);
      setExemplares(data);
      setOpenExemplaresModal(true);
      setTituloDoLivro(
        livros.find((livro) => livro.id === livro_id)?.titulo ||
          "Catálogo de exemplares",
      );
    } catch (error) {
      console.error("Erro ao buscar exemplares:", error);
    }
  }

  const livrosFiltrados = livros.filter((livro) =>
    livro.titulo.toLowerCase().includes(busca.toLowerCase()),
  );

  const LivrosColumns = [
    {
      title: "Título",
      dataIndex: "titulo",
      key: "titulo",
      render: (_: unknown, livro: ILivros) => (
        <Typography.Link onClick={() => handleOpenExemplaresModal(livro.id)}>
          {livro.titulo}
        </Typography.Link>
      ),
    },
    {
      title: "Autores",
      key: "autor",
      render: (_: unknown, livro: ILivros) =>
        livro.autores?.map((a) => a.nome).join(", ") || "—",
    },
    {
      title: "Categorias",
      key: "categoria",
      render: (_: unknown, livro: ILivros) =>
        livro.categorias?.map((c) => c.nome).join(", ") || "—",
    },
    { title: "ISBN", dataIndex: "isbn", key: "isbn" },
    {
      title: "Ação",
      key: "acao",
      render: (_: unknown, livro: ILivros) => (
        <Button
          type="primary"
          onClick={() => handleOpenExemplaresModal(livro.id)}
        >
          Ver Exemplares
        </Button>
      ),
    },
  ];
  const ModalColumns = [
    {
      title: "Código de Patrimônio",
      dataIndex: "codigo_patrimonio",
      key: "codigo_patrimonio",
    },
    {
      title: "Ano de Publicação",
      dataIndex: "ano_publicacao",
      key: "ano_publicacao",
    },
    {
      title: "Editora",
      key: "editora",
      render: (_: unknown, exemplar: IExemplares) =>
        exemplar.livro?.editora?.nome || "—",
    },
    {
      title: "Ação",
      key: "acao",
      render: (_: unknown, exemplar: IExemplares) => (
        <Button
          danger={exemplarSelecionado === exemplar.id}
          type={exemplarSelecionado === exemplar.id ? "default" : "primary"}
          onClick={() => {
            setExemplarSelecionado(
              exemplarSelecionado === exemplar.id ? null : exemplar.id,
            );
            form.resetFields();
          }}
        >
          {exemplarSelecionado === exemplar.id ? "Cancelar" : "Emprestar"}
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Modal
        width={1000}
        onOk={() => setOpenExemplaresModal(false)}
        onCancel={() => {
          setOpenExemplaresModal(false);
          setExemplarSelecionado(null);
          form.resetFields();
        }}
        open={openExemplaresModal}
        footer={null}
      >
        <Typography.Title level={3} style={{ textAlign: "center" }}>
          {tituloDoLivro}
        </Typography.Title>

        <Table
          dataSource={exemplares || []}
          columns={ModalColumns}
          rowKey="id"
        />

        {exemplarSelecionado !== null && (
          <Form
            form={form}
            layout="vertical"
            onFinish={(values) => {
              criarEmprestimo(exemplarSelecionado);
            }}
          >
            <Form.Item
              name="exemplar"
              initialValue={exemplarSelecionado}
              hidden
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="usuario"
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
              rules={[
                { required: true, message: "Informe a data de devolução" },
              ]}
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

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Finalizar Empréstimo
              </Button>
            </Form.Item>
          </Form>
        )}
      </Modal>
      <Typography.Title>Acervo de livros</Typography.Title>
      <Input.Search
        placeholder="Buscar por título..."
        onChange={(e) => setBusca(e.target.value)}
        style={{ marginBottom: 16, maxWidth: 400 }}
      />
      <Table dataSource={livrosFiltrados} columns={LivrosColumns} rowKey="id" />
    </div>
  );
}

export default PaginaInicial;
