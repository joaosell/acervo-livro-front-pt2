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
import { usuarioService } from "../../services/usuarioService";

interface Usuarios {
  id: number;
  nome: string;
  email: string;
  senha: string;
  tipo: number;
}

function Usuarios() {
  const [usuarios, setUsuarios] = useState<Usuarios[]>([]);
  const [busca, setBusca] = useState("");
  const [editando, setEditando] = useState<Usuarios | null>(null);
  const [openNewUsuarioModal, setOpenNewUsuarioModal] =
    useState<boolean>(false);
  const [form] = Form.useForm();
  const [newForm] = Form.useForm();

  const carregar = () => usuarioService.getAll().then(setUsuarios);

  useEffect(() => {
    carregar();
  }, []);

  const abrirEdicao = (usuario: Usuarios) => {
    setEditando(usuario);
    form.setFieldsValue({
      nome: usuario.nome,
      email: usuario.email,
      senha: usuario.senha,
      tipo: usuario.tipo,
    });
  };

  const salvarUsuario = async () => {
    try {
      const values = await newForm.validateFields();
      await usuarioService.create(values);
      carregar();
      setOpenNewUsuarioModal(false);
      newForm.resetFields();
    } catch (e) {
      console.log(e);
    }
  };

  const salvarEdicao = async () => {
    const values = await form.validateFields();
    await usuarioService.update(editando!.id, values);
    setEditando(null);
    carregar();
  };

  const confirmarRemocao = (usuario: Usuarios) => {
    Modal.confirm({
      title: "Remover usuario",
      content: `Deseja remover "${usuario.nome}"?`,
      okType: "danger",
      onOk: async () => {
        await usuarioService.remove(usuario.id);
        carregar();
      },
    });
  };

  const usuariosFiltrados = usuarios.filter((c) =>
    c.nome.toLowerCase().includes(busca.toLowerCase()),
  );

  const columns = [
    { title: "Nome", dataIndex: "nome", key: "nome" },
    {
      title: "Tipo",
      dataIndex: "tipo",
      key: "tipo",
    },
    {
      title: "E-mail",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Senha",
      dataIndex: "senha",
      key: "senha",
    },
    {
      title: "Editar",
      key: "editar",
      render: (_: unknown, usuario: Usuarios) => (
        <Button icon={<EditOutlined />} onClick={() => abrirEdicao(usuario)} />
      ),
    },
    {
      title: "Remover",
      key: "remover",
      render: (_: unknown, usuario: Usuarios) => (
        <Button
          danger
          icon={<DeleteOutlined />}
          onClick={() => confirmarRemocao(usuario)}
        />
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Typography.Title>Usuarios</Typography.Title>
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
          <Button onClick={() => setOpenNewUsuarioModal(true)} type="primary">
            +
          </Button>
        </Col>
      </Row>
      <Table dataSource={usuariosFiltrados} columns={columns} rowKey="id" />

      <Modal
        title="Editar Usuario"
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
            name="email"
            label="E-mail"
            rules={[
              { required: true, type: "email", message: "Informe o e-mail" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="senha"
            label="Senha"
            rules={[{ required: true, message: "Informe a senha" }]}
          >
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Adicionar Usuario"
        open={openNewUsuarioModal}
        onOk={salvarUsuario}
        onCancel={() => {
          newForm.resetFields();
          setOpenNewUsuarioModal(false);
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
            name="email"
            label="E-mail"
            rules={[
              { required: true, type: "email", message: "Informe o e-mail" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="senha"
            label="Senha"
            rules={[{ required: true, message: "Informe a senha" }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="tipo"
            label="Tipo"
            rules={[{ message: "Informe o tipo" }]}
          >
            <Select
              defaultValue={"CLIENTE"}
              options={[
                { value: "ADMIN", label: "Admin" },
                { value: "CLIENTE", label: "Cliente" },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default Usuarios;
