import { useEffect, useState } from "react";
import { Button, Input, Modal, Table, Typography } from "antd";
import { livroService } from "../../services/livroService";
import { exemplarService } from "../../services/exemplarService";
import type { ILivros } from "../../types/Livros";

function Livros() {
  const [livros, setLivros] = useState<ILivros[]>([]);
  const [exemplares, setExemplares] = useState<ILivros[]>([]);
  const [busca, setBusca] = useState("");
  const [openExemplaresModal, setOpenExemplaresModal] = useState(false);

  useEffect(() => {
    livroService.getAll().then(setLivros);
  }, []);

  function handleOpenExemplaresModal(livro_id: number) {
    exemplarService.getAll(livro_id).then(setExemplares);
    setOpenExemplaresModal(true);
  }

  const livrosFiltrados = livros.filter(
    (livro) =>
      livro.titulo.toLowerCase().includes(busca.toLowerCase()) ||
      livro.editora.toLowerCase().includes(busca.toLowerCase()),
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
    { title: "Autor", dataIndex: "autor", key: "autor" },
    { title: "Editora", dataIndex: "editora", key: "editora" },
    { title: "Categoria", dataIndex: "categoria", key: "categoria" },
    { title: "Ano", dataIndex: "ano_publicacao", key: "ano_publicacao" },
    {
      title: "Ação",
      key: "acao",
      render: (_: unknown, livro: ILivros) => (
        <Button
          type="primary"
          onClick={() => alert(`Empréstimo do livro: ${livro.titulo}`)}
        >
          Emprestar
        </Button>
      ),
    },
  ];
  const ModalColumns = [
    {
      title: "Código Patrimônio",
      dataIndex: "codigo_patrimonio",
      key: "codigo_patrimonio",
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Modal
        onOk={() => setOpenExemplaresModal(false)}
        open={openExemplaresModal}
      >
        <Table dataSource={exemplares} columns={ModalColumns} rowKey="id" />
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

export default Livros;
