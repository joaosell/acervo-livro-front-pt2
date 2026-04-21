import { useEffect, useState } from "react";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Table,
  Typography,
} from "antd";
import dayjs from "dayjs";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { exemplarService } from "../../services/exemplarService";
import type { IExemplares } from "../../types/Exemplares";
import type { IEditoras } from "../../types/Editoras";
import type { ILivros } from "../../types/Livros";
import { livroService } from "../../services/livroService";
import { editoraService } from "../../services/editoraService";
import type { IAutores } from "../../types/autores";
import { autorService } from "../../services/autorService";

function Exemplares() {
  const [exemplares, setExemplares] = useState<IExemplares[]>([]);
  const [editoras, setEditoras] = useState<IEditoras[]>([]);
  const [livros, setLivros] = useState<ILivros[]>([]);
  const [autores, setAutores] = useState<IAutores[]>([]);
  const [busca, setBusca] = useState("");
  const [editando, setEditando] = useState<IExemplares | null>(null);
  const [openNewExemplarModal, setOpenNewExemplarModal] =
    useState<boolean>(false);
  const [form] = Form.useForm();
  const [newForm] = Form.useForm();

  const carregar = () => exemplarService.getAll().then(setExemplares);

  useEffect(() => {
    carregar();
    livroService.getAll().then(setLivros);
    editoraService.getAll().then(setEditoras);
    autorService.getAll().then(setAutores);
  }, []);

  const abrirEdicao = (exemplar: IExemplares) => {
    setEditando(exemplar);
    form.setFieldsValue({
      codigo_patrimonio: exemplar.codigo_patrimonio,
      ano_publicacao: dayjs().year(exemplar.ano_publicacao),
      livro_id: exemplar.livro.id || "",
      editora_id: exemplar.editora.id || "",
    });
  };

  const salvarExemplar = async () => {
    try {
      const values = await newForm.validateFields();
      const payload = {
        ...values,
        ano_publicacao: values.ano_publicacao.year(),
      };
      await exemplarService.create(payload);
      carregar();
      setOpenNewExemplarModal(false);
      newForm.resetFields();
    } catch (e) {
      console.log(e);
    }
  };

  const salvarEdicao = async () => {
    const values = await form.validateFields();
    const payload = {
      ...values,
      ano_publicacao: values.ano_publicacao.year(),
    };
    await exemplarService.update(editando!.id, payload);
    setEditando(null);
    carregar();
  };

  const confirmarRemocao = (exemplar: IExemplares) => {
    Modal.confirm({
      title: "Remover exemplar",
      content: `Deseja remover "${exemplar.livro.titulo}"?`,
      okType: "danger",
      onOk: async () => {
        await exemplarService.remove(exemplar.id);
        carregar();
      },
    });
  };

  const exemplaresFiltrados = exemplares.filter((c) =>
    c.livro.titulo.toLowerCase().includes(busca.toLowerCase()),
  );

  const columns = [
    {
      title: "Código de Patrimônio",
      dataIndex: "codigo_patrimonio",
      key: "codigo_patrimonio",
    },
    {
      title: "Título",
      key: "titulo",
      render: (_: unknown, exemplar: IExemplares) =>
        exemplar.livro?.titulo || "—",
    },
    {
      title: "Ano de Publicação",
      dataIndex: "ano_publicacao",
      key: "ano_publicacao",
    },
    {
      title: "Autores",
      key: "autor",
      render: (_: unknown, exemplar: IExemplares) => {
        const livro = livros.find((l) => l.id === exemplar.livro.id);
        return (
          livro?.autor
            ?.map((a) => {
              const autor = autores.find((au) => au.id === a.id);
              return autor?.nome;
            })
            .join(", ") || "—"
        );
      },
    },
    {
      title: "Editora",
      key: "editora",
      render: (_: unknown, exemplar: IExemplares) =>
        exemplar.editora?.nome || "—",
    },
    {
      title: "Editar",
      key: "editar",
      render: (_: unknown, exemplar: IExemplares) => (
        <Button icon={<EditOutlined />} onClick={() => abrirEdicao(exemplar)} />
      ),
    },
    {
      title: "Remover",
      key: "remover",
      render: (_: unknown, exemplar: IExemplares) => (
        <Button
          danger
          icon={<DeleteOutlined />}
          onClick={() => confirmarRemocao(exemplar)}
        />
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Typography.Title>Exemplares</Typography.Title>
      <Row
        justify="center"
        align="middle"
        style={{ marginBottom: 16, position: "relative" }}
      >
        <Col>
          <Input.Search
            placeholder="Buscar por nome..."
            onChange={(e) => setBusca(e.target.value)}
            style={{ width: 400 }}
          />
        </Col>
        <Col style={{ position: "absolute", right: 0 }}>
          <Button onClick={() => setOpenNewExemplarModal(true)} type="primary">
            +
          </Button>
        </Col>
      </Row>
      <Table dataSource={exemplaresFiltrados} columns={columns} rowKey="id" />

      <Modal
        title="Editar Exemplar"
        open={!!editando}
        onOk={salvarEdicao}
        onCancel={() => setEditando(null)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="codigo_patrimonio"
            label="Código de Patrimônio"
            rules={[
              {
                pattern: /^[0-9]+$/,
                message: "Somente números são permitidos",
              },
              { required: true, message: "Informe o código de patrimônio" },
            ]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="ano_publicacao"
            label="Ano de Publicação"
            rules={[{ required: true, message: "Informe o ano de publicação" }]}
          >
            <DatePicker
              picker="year"
              style={{ width: "100%" }}
              placeholder="Selecione o ano"
            />
          </Form.Item>

          <Form.Item
            name="livro_id"
            label="Livro"
            rules={[{ required: true, message: "Informe o livro" }]}
          >
            <Select
              placeholder="Selecione o livro"
              options={livros.map((c: ILivros) => ({
                value: c.id,
                label: c.titulo,
              }))}
            />
          </Form.Item>

          <Form.Item
            name="editora_id"
            label="Editora"
            rules={[{ required: true, message: "Informe a editora" }]}
          >
            <Select
              placeholder="Selecione a editora"
              options={editoras.map((c: IEditoras) => ({
                value: c.id,
                label: c.nome,
              }))}
            />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Adicionar Exemplar"
        open={openNewExemplarModal}
        onOk={salvarExemplar}
        onCancel={() => {
          newForm.resetFields();
          setOpenNewExemplarModal(false);
        }}
      >
        <Form form={newForm} layout="vertical">
          <Form.Item
            name="codigo_patrimonio"
            label="Código de Patrimônio"
            rules={[
              {
                pattern: /^[0-9]+$/,
                message: "Somente números são permitidos",
              },
              { required: true, message: "Informe o código de patrimônio" },
            ]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="ano_publicacao"
            label="Ano de Publicação"
            rules={[{ required: true, message: "Informe o ano de publicação" }]}
          >
            <DatePicker
              picker="year"
              style={{ width: "100%" }}
              placeholder="Selecione o ano"
            />
          </Form.Item>

          <Form.Item
            name="livro_id"
            label="Livro"
            rules={[{ required: true, message: "Informe o livro" }]}
          >
            <Select
              placeholder="Selecione o livro"
              options={livros.map((c: ILivros) => ({
                value: c.id,
                label: c.titulo,
              }))}
            />
          </Form.Item>

          <Form.Item
            name="editora_id"
            label="Editora"
            rules={[{ required: true, message: "Informe a editora" }]}
          >
            <Select
              placeholder="Selecione a editora"
              options={editoras.map((c: IEditoras) => ({
                value: c.id,
                label: c.nome,
              }))}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default Exemplares;
