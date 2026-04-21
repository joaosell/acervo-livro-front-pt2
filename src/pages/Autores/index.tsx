import { useEffect, useState } from "react";
import { Button, Col, Form, Input, Modal, Row, Table, Typography } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { autorService } from "../../services/autorService";
import type { IAutores } from "../../types/autores";

function Autores() {
  const [autores, setAutores] = useState<IAutores[]>([]);
  const [busca, setBusca] = useState("");
  const [editando, setEditando] = useState<IAutores | null>(null);
  const [openNewAutorModal, setOpenNewAutorModal] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [newForm] = Form.useForm();

  const carregar = () => autorService.getAll().then(setAutores);

  useEffect(() => {
    carregar();
  }, []);

  const abrirEdicao = (autor: IAutores) => {
    setEditando(autor);
    form.setFieldsValue({
      nome: autor.nome,
      nacionalidade: autor.nacionalidade,
    });
  };

  const salvarAutor = async () => {
    try {
      const values = await newForm.validateFields();
      await autorService.create(values);
      carregar();
      setOpenNewAutorModal(false);
      newForm.resetFields();
    } catch (e) {
      console.log(e);
    }
  };

  const salvarEdicao = async () => {
    const values = await form.validateFields();
    await autorService.update(editando!.id, values);
    setEditando(null);
    carregar();
  };

  const confirmarRemocao = (autor: IAutores) => {
    Modal.confirm({
      title: "Remover autor",
      content: `Deseja remover "${autor.nome}"?`,
      okType: "danger",
      onOk: async () => {
        await autorService.remove(autor.id);
        carregar();
      },
    });
  };

  const autorsFiltradas = autores.filter((c) =>
    c.nome.toLowerCase().includes(busca.toLowerCase()),
  );

  const columns = [
    { title: "Nome", dataIndex: "nome", key: "nome" },
    {
      title: "Nacionalidade",
      dataIndex: "nacionalidade",
      key: "nacionalidade",
    },
    {
      title: "Editar",
      key: "editar",
      render: (_: unknown, autor: IAutores) => (
        <Button icon={<EditOutlined />} onClick={() => abrirEdicao(autor)} />
      ),
    },
    {
      title: "Remover",
      key: "remover",
      render: (_: unknown, autor: IAutores) => (
        <Button
          danger
          icon={<DeleteOutlined />}
          onClick={() => confirmarRemocao(autor)}
        />
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Typography.Title>Autores</Typography.Title>
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
          <Button onClick={() => setOpenNewAutorModal(true)} type="primary">
            +
          </Button>
        </Col>
      </Row>
      <Table dataSource={autorsFiltradas} columns={columns} rowKey="id" />

      <Modal
        title="Editar Autor"
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
            name="nacionalidade"
            label="Nacionalidade"
            rules={[{ required: true, message: "Informe a nacionalidade" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Adicionar Autor"
        open={openNewAutorModal}
        onOk={salvarAutor}
        onCancel={() => {
          newForm.resetFields();
          setOpenNewAutorModal(false);
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
            name="nacionalidade"
            label="Nacionalidade"
            rules={[{ required: true, message: "Informe a nacionalidade" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default Autores;
