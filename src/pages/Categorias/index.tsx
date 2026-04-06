import { useEffect, useState } from "react";
import { Button, Form, Input, Modal, Table, Typography } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { categoriaService } from "../../services/categoriaService";

interface Categoria {
  id: number;
  nome: string;
}

function Categorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [busca, setBusca] = useState("");
  const [editando, setEditando] = useState<Categoria | null>(null);
  const [form] = Form.useForm();

  const carregar = () => categoriaService.getAll().then(setCategorias);

  useEffect(() => {
    carregar();
  }, []);

  const abrirEdicao = (categoria: Categoria) => {
    setEditando(categoria);
    form.setFieldsValue({ nome: categoria.nome });
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
      <Input.Search
        placeholder="Buscar por nome..."
        onChange={(e) => setBusca(e.target.value)}
        style={{ marginBottom: 16, maxWidth: 400 }}
      />
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
        </Form>
      </Modal>
    </div>
  );
}

export default Categorias;
