import { Button, Table, Typography } from "antd";
import { useState } from "react";

function App() {
  const [editoras, setEditoras] = useState([]);

  const handleClick = async () => {
    const response = await fetch("http://localhost:3000/editoras");
    const data = await response.json();
    setEditoras(data);
  };
  const columns = [
    {
      title: "Nome",
      dataIndex: "nome",
      key: "nome",
    },
    {
      title: "Cidade",
      dataIndex: "cidade",
      key: "cidade",
    },
  ];

  return (
    <>
      <Typography.Title>Acervo de livros</Typography.Title>
      <Typography>Clique aqui para mostrar todas as editoras</Typography>
      <Button onClick={handleClick}>mostrar</Button>
      <Table dataSource={editoras} columns={columns} />
    </>
  );
}

export default App;
