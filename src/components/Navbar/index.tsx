import { Menu } from "antd";
import { useNavigate, useLocation } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const items = [
    { key: "/", label: "Página Inicial" },
    { key: "/emprestimos", label: "Empréstimos" },
    { key: "/configuracoes", label: "Configurações" },
    { key: "/buscaavancada", label: "Busca Avançada" },
  ];

  return (
    <Menu
      mode="horizontal"
      selectedKeys={[location.pathname]}
      items={items}
      onClick={({ key }) => navigate(key)}
    />
  );
}

export default Navbar;
