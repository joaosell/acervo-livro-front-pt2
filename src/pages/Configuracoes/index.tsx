import { Button, Col, Row, Typography } from "antd";
import { useNavigate } from "react-router-dom";

const botoes = [
  { label: "Livro", rota: "/livros" },
  { label: "Categorias", rota: "/categorias" },
  { label: "Editoras", rota: "/editoras" },
  { label: "Usuários", rota: "/usuarios" },
  { label: "Autores", rota: "/autores" },
  { label: "Exemplares", rota: "/exemplares" },
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
