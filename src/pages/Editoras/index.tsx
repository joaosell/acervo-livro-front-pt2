import { useEffect, useState } from "react";
import { Button, Col, Form, Input, Modal, Row, Table, Typography } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { editoraService } from "../../services/editoraService";

interface Editoras {
  id: number;
  nome: string;
  cidade: string;
}

function Editoras() {
  const [editoras, setEditoras] = useState<Editoras[]>([]);
  const [busca, setBusca] = useState("");
  const [editando, setEditando] = useState<Editoras | null>(null);
  const [openNewEditoraModal, setOpenNewEditoraModal] =
    useState<boolean>(false);
  const [form] = Form.useForm();
  const [newForm] = Form.useForm();

  const carregar = () => editoraService.getAll().then(setEditoras);

  useEffect(() => {
    carregar();
  }, []);

  const abrirEdicao = (editora: Editoras) => {
    setEditando(editora);
    form.setFieldsValue({
      nome: editora.nome,
      cidade: editora.cidade,
    });
  };

  const salvarEditora = async () => {
    try {
      const values = await newForm.validateFields();
      await editoraService.create(values);
      carregar();
      setOpenNewEditoraModal(false);
      newForm.resetFields();
    } catch (e) {
      console.log(e);
    }
  };

  const salvarEdicao = async () => {
    const values = await form.validateFields();
    await editoraService.update(editando!.id, values);
    setEditando(null);
    carregar();
  };

  const confirmarRemocao = (editora: Editoras) => {
    Modal.confirm({
      title: "Remover editora",
      content: `Deseja remover "${editora.nome}"?`,
      okType: "danger",
      onOk: async () => {
        await editoraService.remove(editora.id);
        carregar();
      },
    });
  };

  const editorasFiltradas = editoras.filter((c) =>
    c.nome.toLowerCase().includes(busca.toLowerCase()),
  );

  const columns = [
    { title: "Nome", dataIndex: "nome", key: "nome" },
    {
      title: "Cidade",
      dataIndex: "cidade",
      key: "cidade",
    },
    {
      title: "Editar",
      key: "editar",
      render: (_: unknown, editora: Editoras) => (
        <Button icon={<EditOutlined />} onClick={() => abrirEdicao(editora)} />
      ),
    },
    {
      title: "Remover",
      key: "remover",
      render: (_: unknown, editora: Editoras) => (
        <Button
          danger
          icon={<DeleteOutlined />}
          onClick={() => confirmarRemocao(editora)}
        />
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Typography.Title>Editoras</Typography.Title>
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
          <Button onClick={() => setOpenNewEditoraModal(true)} type="primary">
            +
          </Button>
        </Col>
      </Row>
      <Table dataSource={editorasFiltradas} columns={columns} rowKey="id" />

      <Modal
        title="Editar Editora"
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
            name="cidade"
            label="Cidade"
            rules={[{ required: true, message: "Informe a cidade" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Adicionar Editora"
        open={openNewEditoraModal}
        onOk={salvarEditora}
        onCancel={() => {
          newForm.resetFields();
          setOpenNewEditoraModal(false);
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
            name="cidade"
            label="Cidade"
            rules={[{ required: true, message: "Informe a cidade" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default Editoras;
