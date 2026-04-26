import { useEffect, useState } from "react";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Row,
  Select,
  Switch,
  Table,
  Tag,
  Typography,
} from "antd";
import { livroService } from "../../services/livroService";
import { emprestimoService } from "../../services/emprestimoService";
import { autorService } from "../../services/autorService";
import { categoriaService } from "../../services/categoriaService";
import { usuarioService } from "../../services/usuarioService";
import { exemplarService } from "../../services/exemplarService";
import type { ILivros } from "../../types/Livros";
import type { IEmprestimo } from "../../types/Emprestimos";

type TipoBusca = "livros" | "emprestimos";

function BuscaAvancada() {
  const [form] = Form.useForm();
  const [tipoBusca, setTipoBusca] = useState<TipoBusca | null>(null);
  const [livroSelecionado, setLivroSelecionado] = useState<number | null>(null);
  const [resultados, setResultados] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [jaBuscou, setJaBuscou] = useState(false);

  const [livros, setLivros] = useState<any[]>([]);
  const [autores, setAutores] = useState<any[]>([]);
  const [categorias, setCategorias] = useState<any[]>([]);
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [exemplares, setExemplares] = useState<any[]>([]);

  useEffect(() => {
    livroService.getAll().then(setLivros);
    autorService.getAll().then(setAutores);
    categoriaService.getAll().then(setCategorias);
    usuarioService.getAll().then(setUsuarios);
  }, []);

  useEffect(() => {
    if (livroSelecionado) {
      exemplarService.getByBook(livroSelecionado).then(setExemplares);
    } else {
      setExemplares([]);
      form.setFieldValue("exemplar_id", undefined);
    }
  }, [livroSelecionado]);

  async function handleFiltrar(values: any) {
    setCarregando(true);
    setJaBuscou(true);
    try {
      if (tipoBusca === "livros") {
        const data = await livroService.buscarAvancado({
          categoria_id: values.categoria_id,
          autor_id: values.autor_id,
          onlyDisponiveis: values.onlyDisponiveis ?? false,
        });
        setResultados(data);
      } else {
        const data = await emprestimoService.buscarAvancado({
          livro_id: values.livro_id,
          usuario_id: values.usuario_id,
          exemplar_id: values.exemplar_id,
          data_inicio: values.data_emprestimo?.[0]?.toISOString(),
          data_fim: values.data_emprestimo?.[1]?.toISOString(),
          ativo: values.ativo ?? undefined,
        });
        setResultados(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCarregando(false);
    }
  }

  function handleTipoBuscaChange(value: TipoBusca) {
    setTipoBusca(value);
    setJaBuscou(false);
    setResultados([]);
    form.resetFields([
      "categoria_id",
      "autor_id",
      "onlyDisponiveis",
      "livro_id",
      "usuario_id",
      "exemplar_id",
      "data_emprestimo",
      "ativo",
    ]);
  }

  const colunasLivros = [
    {
      title: "Título",
      key: "titulo",
      render: (_: unknown, livro: ILivros) => livro.titulo || "—",
    },
    {
      title: "Autores",
      key: "autores",
      render: (_: unknown, livro: ILivros) =>
        livro.autor?.map((a: any) => <Tag key={a.id}>{a.nome}</Tag>) || "—",
    },
    {
      title: "Categorias",
      key: "categorias",
      render: (_: unknown, livro: ILivros) =>
        livro.categoria?.map((c: any) => <Tag key={c.id}>{c.nome}</Tag>) || "—",
    },
    {
      title: "Exemplar Disponível",
      key: "disponivel",
      render: (_: unknown, livro: any) =>
        livro.temExemplarDisponivel ? (
          <Tag color="green">Sim</Tag>
        ) : (
          <Tag color="red">Não</Tag>
        ),
    },
  ];

  const colunasEmprestimos = [
    {
      title: "Livro",
      key: "livro",
      render: (_: unknown, e: IEmprestimo) => e.exemplar?.livro?.titulo || "—",
    },
    {
      title: "Usuário",
      key: "usuario",
      render: (_: unknown, e: IEmprestimo) => e.usuario?.nome || "—",
    },
    {
      title: "Código Patrimônio",
      key: "codigo",
      render: (_: unknown, e: IEmprestimo) =>
        e.exemplar?.codigo_patrimonio || "—",
    },
    {
      title: "Categorias",
      key: "categorias",
      render: (_: unknown, e: IEmprestimo) =>
        e.exemplar?.livro?.categoria?.map((c: any) => (
          <Tag key={c.id}>{c.nome}</Tag>
        )) || "—",
    },
    {
      title: "Data Empréstimo",
      key: "data_emprestimo",
      render: (_: unknown, e: IEmprestimo) =>
        new Date(e.data_emprestimo).toLocaleDateString("pt-BR"),
      sorter: (a: IEmprestimo, b: IEmprestimo) =>
        new Date(a.data_emprestimo).getTime() -
        new Date(b.data_emprestimo).getTime(),
    },
    {
      title: "Data Devolução",
      key: "data_devolucao",
      render: (_: unknown, e: IEmprestimo) =>
        new Date(e.data_devolucao).toLocaleDateString("pt-BR"),
      sorter: (a: IEmprestimo, b: IEmprestimo) =>
        new Date(a.data_devolucao).getTime() -
        new Date(b.data_devolucao).getTime(),
    },
    {
      title: "Ativo",
      key: "ativo",
      render: (_: unknown, e: IEmprestimo) =>
        e.ativo ? <Tag color="green">Sim</Tag> : <Tag color="red">Não</Tag>,
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Typography.Title>Busca Avançada</Typography.Title>

      <Form form={form} layout="vertical" onFinish={handleFiltrar}>
        <Form.Item
          name="tipo"
          label="Buscar por"
          rules={[{ required: true, message: "Selecione o tipo" }]}
        >
          <Select
            placeholder="Selecione o tipo de busca"
            onChange={handleTipoBuscaChange}
            options={[
              { value: "livros", label: "Livros" },
              { value: "emprestimos", label: "Empréstimos" },
            ]}
          />
        </Form.Item>
        {tipoBusca === "livros" && (
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="autor_id" label="Autor">
                <Select
                  placeholder="Selecione o autor"
                  allowClear
                  options={autores.map((a) => ({ value: a.id, label: a.nome }))}
                />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item name="categoria_id" label="Categoria">
                <Select
                  placeholder="Selecione a categoria"
                  allowClear
                  options={categorias.map((c) => ({
                    value: c.id,
                    label: c.nome,
                  }))}
                />
              </Form.Item>
            </Col>

            <Col
              span={8}
              style={{ display: "flex", alignItems: "center", paddingTop: 30 }}
            >
              <Form.Item
                name="onlyDisponiveis"
                valuePropName="checked"
                style={{ marginBottom: 0 }}
              >
                <Switch />
              </Form.Item>
              <Typography.Text style={{ marginLeft: 8 }}>
                Somente com exemplares disponíveis
              </Typography.Text>
            </Col>
          </Row>
        )}
        {tipoBusca === "emprestimos" && (
          <>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item name="livro_id" label="Livro">
                  <Select
                    placeholder="Selecione o livro"
                    allowClear
                    onChange={(value) => setLivroSelecionado(value ?? null)}
                    options={livros.map((l) => ({
                      value: l.id,
                      label: l.titulo,
                    }))}
                  />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item name="usuario_id" label="Usuário">
                  <Select
                    placeholder="Selecione o usuário"
                    allowClear
                    options={usuarios.map((u) => ({
                      value: u.id,
                      label: u.nome,
                    }))}
                  />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item name="data_emprestimo" label="Período de Empréstimo">
                  <DatePicker.RangePicker
                    style={{ width: "100%" }}
                    format="DD/MM/YYYY"
                    placeholder={["Data inicial", "Data final"]}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              {livroSelecionado && (
                <Col span={8}>
                  <Form.Item name="exemplar_id" label="Exemplar">
                    <Select
                      placeholder="Selecione o exemplar"
                      allowClear
                      options={exemplares.map((e) => ({
                        value: e.id,
                        label: `Patrimônio: ${e.codigo_patrimonio}`,
                      }))}
                    />
                  </Form.Item>
                </Col>
              )}

              <Col span={8}>
                <Form.Item name="ativo" label="Status">
                  <Select
                    placeholder="Todos"
                    allowClear
                    options={[
                      { value: true, label: "Somente ativos" },
                      { value: false, label: "Somente inativos" },
                    ]}
                  />
                </Form.Item>
              </Col>
            </Row>
          </>
        )}
        {tipoBusca && (
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={carregando}>
              Filtrar
            </Button>
          </Form.Item>
        )}
      </Form>

      {jaBuscou && (
        <>
          <Typography.Title level={4} style={{ marginTop: 24 }}>
            Resultados {resultados.length > 0 ? `(${resultados.length})` : ""}
          </Typography.Title>
          <Table
            dataSource={resultados}
            columns={
              tipoBusca === "livros"
                ? (colunasLivros as any)
                : (colunasEmprestimos as any)
            }
            rowKey="id"
            locale={{ emptyText: "Nenhum resultado encontrado" }}
            loading={carregando}
          />
        </>
      )}
    </div>
  );
}

export default BuscaAvancada;
