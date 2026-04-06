import { Menu } from "antd";
import { useNavigate, useLocation } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const items = [
    { key: "/livros", label: "Livros" },
    { key: "/emprestimos", label: "Meus empréstimos" },
    { key: "/configuracoes", label: "Configurações" },
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
