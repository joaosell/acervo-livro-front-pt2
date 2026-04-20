import { Button, Col, Row, Typography } from "antd";
import { useNavigate } from "react-router-dom";

const botoes = [
  { label: "Adicionar Livro", rota: "/livros/editar" },
  { label: "Categorias", rota: "/categorias" },
  { label: "Acessar Editoras", rota: "/editoras" },
  { label: "Acessar Usuários", rota: "/usuarios" },
  { label: "Acessar Autores", rota: "/autores" },
  { label: "Acessar Exemplares", rota: "/exemplares" },
];

function Configuracoes() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: 24 }}>
      <Typography.Title>Configurações</Typography.Title>
      <Row gutter={[16, 16]}>
        {botoes.map((botao) => (
          <Col key={botao.rota} xs={24} sm={12} md={8}>
            <Button
              type="primary"
              block
              style={{ height: 80, fontSize: 16 }}
              onClick={() => navigate(botao.rota)}
            >
              {botao.label}
            </Button>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default Configuracoes;
