import { useEffect, useState } from "react";
import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Table,
  Typography,
} from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { livroService } from "../../services/livroService";
import type { ILivros } from "../../types/Livros";
import { autorService } from "../../services/autorService";
import { categoriaService } from "../../services/categoriaService";
import type { IAutores } from "../../types/autores";
import type { ICategoria } from "../../types/Categorias";

function EditarLivros() {
  const [livros, setLivros] = useState<ILivros[]>([]);
  const [autores, setAutores] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [busca, setBusca] = useState("");
  const [editando, setEditando] = useState<ILivros | null>(null);
  const [openNewLivroModal, setOpenNewLivroModal] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [newForm] = Form.useForm();

  const carregar = () => livroService.getAll().then(setLivros);

  useEffect(() => {
    carregar();
    autorService.getAll().then(setAutores);
    categoriaService.getAll().then(setCategorias);
  }, []);

  const abrirEdicao = (livro: ILivros) => {
    setEditando(livro);
    form.setFieldsValue({
      titulo: livro.titulo,
      isbn: livro.isbn,
      autor_id: livro.autor?.map((a) => a.id) ?? [],
      categoria_id: livro.categoria?.map((c) => c.id) ?? [],
    });
  };

  const salvarLivro = async () => {
    try {
      const values = await newForm.validateFields();
      await livroService.create(values);
      carregar();
      setOpenNewLivroModal(false);
      newForm.resetFields();
    } catch (e) {
      console.log(e);
    }
  };

  const salvarEdicao = async () => {
    const values = await form.validateFields();
    await livroService.update(editando!.id, values);
    setEditando(null);
    carregar();
  };

  const confirmarRemocao = (livro: ILivros) => {
    Modal.confirm({
      title: "Remover livro",
      content: `Deseja remover "${livro.titulo}"?`,
      okType: "danger",
      onOk: async () => {
        await livroService.remove(livro.id);
        carregar();
      },
    });
  };

  const livrosFiltrados = livros.filter((c) =>
    c.titulo.toLowerCase().includes(busca.toLowerCase()),
  );

  const columns = [
    { title: "Título", dataIndex: "titulo", key: "titulo" },
    { title: "ISBN", dataIndex: "isbn", key: "isbn" },
    {
      title: "Autores",
      key: "autor",
      render: (_: unknown, livro: ILivros) =>
        livro.autor?.map((a) => a.nome).join(", ") || "—",
    },
    {
      title: "Categorias",
      key: "categoria",
      render: (_: unknown, livro: ILivros) =>
        livro.categoria?.map((c) => c.nome).join(", ") || "—",
    },
    {
      title: "Editar",
      key: "editar",
      render: (_: unknown, livro: ILivros) => (
        <Button icon={<EditOutlined />} onClick={() => abrirEdicao(livro)} />
      ),
    },
    {
      title: "Remover",
      key: "remover",
      render: (_: unknown, livro: ILivros) => (
        <Button
          danger
          icon={<DeleteOutlined />}
          onClick={() => confirmarRemocao(livro)}
        />
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Typography.Title>Livros</Typography.Title>
      <Row
        justify="center"
        align="middle"
        style={{ marginBottom: 16, position: "relative" }}
      >
        <Col>
          <Input.Search
            placeholder="Buscar por título..."
            onChange={(e) => setBusca(e.target.value)}
            style={{ width: 400 }}
          />
        </Col>
        <Col style={{ position: "absolute", right: 0 }}>
          <Button onClick={() => setOpenNewLivroModal(true)} type="primary">
            +
          </Button>
        </Col>
      </Row>
      <Table dataSource={livrosFiltrados} columns={columns} rowKey="id" />

      <Modal
        title="Editar Livro"
        open={!!editando}
        onOk={salvarEdicao}
        onCancel={() => setEditando(null)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="titulo"
            label="Título"
            rules={[{ required: true, message: "Informe o título" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="isbn"
            label="ISBN"
            rules={[{ required: true, message: "Informe o ISBN" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="autor_id"
            label="Autores"
            rules={[{ required: true, message: "Informe o(s) Autor(es)" }]}
          >
            <Select
              mode="multiple"
              options={autores.map((a: IAutores) => ({
                value: a.id,
                label: a.nome,
              }))}
              placeholder="Selecione os autores"
            />
          </Form.Item>

          <Form.Item
            name="categoria_id"
            label="Categorias"
            rules={[{ required: true, message: "Informe a(s) Categoria(s)" }]}
          >
            <Select
              mode="multiple"
              options={categorias.map((c: ICategoria) => ({
                value: c.id,
                label: c.nome,
              }))}
              placeholder="Selecione as categorias"
            />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Adicionar Livro"
        open={openNewLivroModal}
        onOk={salvarLivro}
        onCancel={() => {
          newForm.resetFields();
          setOpenNewLivroModal(false);
        }}
      >
        <Form form={newForm} layout="vertical">
          <Form.Item
            name="titulo"
            label="Título"
            rules={[{ required: true, message: "Informe o título" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="isbn"
            label="ISBN"
            rules={[{ required: true, message: "Informe o ISBN" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="autor_id"
            label="Autores"
            rules={[{ required: true, message: "Informe o(s) Autor(es)" }]}
          >
            <Select
              mode="multiple"
              options={autores.map((a: IAutores) => ({
                value: a.id,
                label: a.nome,
              }))}
              placeholder="Selecione os autores"
            />
          </Form.Item>
          <Form.Item
            name="categoria_id"
            label="Categorias"
            rules={[{ required: true, message: "Informe a(s) Categoria(s)" }]}
          >
            <Select
              mode="multiple"
              options={categorias.map((c: ICategoria) => ({
                value: c.id,
                label: c.nome,
              }))}
              placeholder="Selecione as categorias"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default EditarLivros;
