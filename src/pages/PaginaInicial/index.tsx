import { useEffect, useState } from "react";
import { Button, Input, Modal, Table, Typography } from "antd";
import { livroService } from "../../services/livroService";
import { exemplarService } from "../../services/exemplarService";
import type { IExemplares } from "../../types/Exemplares";

// NAO TA PRONTO AINDA
function PaginaInicial() {
  const [livros, setLivros] = useState<IExemplares[]>([]);
  const [exemplares, setExemplares] = useState<IExemplares[]>([]);
  const [busca, setBusca] = useState("");
  const [openExemplaresModal, setOpenExemplaresModal] = useState(false);

  useEffect(() => {
    exemplarService.getAll().then(setLivros);
  }, []);

  function handleOpenExemplaresModal(livro_id: number) {
    exemplarService.getByBook(livro_id).then(setExemplares);
    setOpenExemplaresModal(true);
  }

  const livrosFiltrados = livros.filter(
    (livro) =>
      livro.livro.titulo.toLowerCase().includes(busca.toLowerCase()) ||
      livro.editora.nome.toLowerCase().includes(busca.toLowerCase()),
  );

  const LivrosColumns = [
    {
      title: "Título",
      dataIndex: "titulo",
      key: "titulo",
      render: (_: unknown, exemplar: IExemplares) => (
        <Typography.Link onClick={() => handleOpenExemplaresModal(exemplar.id)}>
          {exemplar.livro.titulo}
        </Typography.Link>
      ),
    },
    {
      title: "Autores",
      key: "autor",
      render: (_: unknown, exemplar: IExemplares) =>
        exemplar.autor?.map((a) => a.nome).join(", ") || "—",
    },
    {
      title: "Categorias",
      key: "categoria",
      render: (_: unknown, livro: IExemplares) =>
        livro.categoria?.map((c) => c.nome).join(", ") || "—",
    },
    { title: "Editora", dataIndex: "editora", key: "editora" },

    { title: "Ano", dataIndex: "ano_publicacao", key: "ano_publicacao" },
    {
      title: "Ação",
      key: "acao",
      render: (_: unknown, livro: IExemplares) => (
        <Button
          type="primary"
          onClick={() => alert(`Empréstimo do livro: ${livro.livro.titulo}`)}
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

export default PaginaInicial;
