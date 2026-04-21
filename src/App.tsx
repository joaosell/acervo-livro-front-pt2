import { BrowserRouter, Routes, Route } from "react-router-dom";
import Livros from "./pages/Livros";
import Layout from "./components/Layout";
import Emprestimos from "./pages/Emprestimos";
import Configuracoes from "./pages/Configuracoes";
import Categorias from "./pages/Categorias";
import Autores from "./pages/Autores";
import Editoras from "./pages/Editoras";
import Usuarios from "./pages/Usuarios";
import EditarLivros from "./pages/EditarLivros";
import Exemplares from "./pages/Exemplares";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Livros />} />
        <Route element={<Layout />}>
          <Route path="/livros" element={<EditarLivros />} />
          <Route path="/emprestimos" element={<Emprestimos />} />
          <Route path="/configuracoes" element={<Configuracoes />} />
          <Route path="/categorias" element={<Categorias />} />
          <Route path="/editoras" element={<Editoras />} />
          <Route path="/usuarios" element={<Usuarios />} />
          <Route path="/autores" element={<Autores />} />
          <Route path="/exemplares" element={<Exemplares />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
export default App;
