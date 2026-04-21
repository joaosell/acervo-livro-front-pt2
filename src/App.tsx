import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Livros from "./pages/Livros";
import Layout from "./components/Layout";
import Emprestimos from "./pages/Emprestimos";
import Configuracoes from "./pages/Configuracoes";
import Categorias from "./pages/Categorias";
import Autores from "./pages/Autores";
import Editoras from "./pages/Editoras";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<Layout />}>
          <Route path="/livros" element={<Livros />} />
          <Route path="/livros/editar" element={<div>Editar Livros</div>} />
          <Route path="/emprestimos" element={<Emprestimos />} />
          <Route path="/configuracoes" element={<Configuracoes />} />
          <Route path="/categorias" element={<Categorias />} />
          <Route path="/editoras" element={<Editoras />} />
          <Route path="/usuarios" element={<div>Usuários</div>} />
          <Route path="/autores" element={<Autores />} />
          <Route path="/exemplares" element={<div>Exemplares</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
export default App;
