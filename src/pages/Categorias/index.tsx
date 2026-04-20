import { useEffect, useState } from "react";
import { Button, Col, Form, Input, Modal, Row, Table, Typography } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { categoriaService } from "../../services/categoriaService";

interface Categoria {
  id: number;
  nome: string;
  descricao: string;
}

function Categorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [busca, setBusca] = useState("");
  const [editando, setEditando] = useState<Categoria | null>(null);
  const [openNewCategoriaModal, setOpenNewCategoriaModal] =
    useState<boolean>(false);
  const [form] = Form.useForm();
  const [newForm] = Form.useForm();

  const carregar = () => categoriaService.getAll().then(setCategorias);

  useEffect(() => {
    carregar();
  }, []);

  const abrirEdicao = (categoria: Categoria) => {
    setEditando(categoria);
    form.setFieldsValue({
      nome: categoria.nome,
      descricao: categoria.descricao,
    });
  };

  const salvarCategoria = async () => {
    try {
      const values = await newForm.validateFields();
      await categoriaService.create(values);
      carregar();
      setOpenNewCategoriaModal(false);
      newForm.resetFields();
    } catch (e) {
      console.log(e);
    }
  };

  const salvarEdicao = async () => {
    const values = await form.validateFields();
    await categoriaService.update(editando!.id, values);
    setEditando(null);
    carregar();
  };

  const confirmarRemocao = (categoria: Categoria) => {
    Modal.confirm({
      title: "Remover categoria",
      content: `Deseja remover "${categoria.nome}"?`,
      okType: "danger",
      onOk: async () => {
        await categoriaService.remove(categoria.id);
        carregar();
      },
    });
  };

  const categoriasFiltradas = categorias.filter((c) =>
    c.nome.toLowerCase().includes(busca.toLowerCase()),
  );

  const columns = [
    { title: "Nome", dataIndex: "nome", key: "nome" },
    { title: "Descrição", dataIndex: "descricao", key: "descricao" },
    {
      title: "Editar",
      key: "editar",
      render: (_: unknown, categoria: Categoria) => (
        <Button
          icon={<EditOutlined />}
          onClick={() => abrirEdicao(categoria)}
        />
      ),
    },
    {
      title: "Remover",
      key: "remover",
      render: (_: unknown, categoria: Categoria) => (
        <Button
          danger
          icon={<DeleteOutlined />}
          onClick={() => confirmarRemocao(categoria)}
        />
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Typography.Title>Categorias</Typography.Title>
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
          <Button onClick={() => setOpenNewCategoriaModal(true)} type="primary">
            +
          </Button>
        </Col>
      </Row>
      <Table dataSource={categoriasFiltradas} columns={columns} rowKey="id" />

      <Modal
        title="Editar Categoria"
        open={!!editando}
        onOk={salvarEdicao}
        onCancel={() => setEditando(null)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="nome"
            label="Nome"
            rules={[{ required: true, message: "Informe o nome" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="descricao"
            label="Descrição"
            rules={[{ required: true, message: "Informe a descrição" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Adicionar Categoria"
        open={openNewCategoriaModal}
        onOk={salvarCategoria}
        onCancel={() => {
          newForm.resetFields();
          setOpenNewCategoriaModal(false);
        }}
      >
        <Form form={newForm} layout="vertical">
          <Form.Item
            name="nome"
            label="Nome"
            rules={[{ required: true, message: "Informe o nome" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="descricao"
            label="Descrição"
            rules={[{ required: true, message: "Informe a descrição" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default Categorias;
