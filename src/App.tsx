import { BrowserRouter, Routes, Route } from "react-router-dom";
import PaginaInicial from "./pages/PaginaInicial";
import Layout from "./components/Layout";
import Emprestimos from "./pages/Emprestimos";
import Configuracoes from "./pages/Configuracoes";
import Categorias from "./pages/Categorias";
import Autores from "./pages/Autores";
import Editoras from "./pages/Editoras";
import Usuarios from "./pages/Usuarios";
import Exemplares from "./pages/Exemplares";
import Livros from "./pages/Livros";
import NotFound from "./pages/NotFound";
import BuscaAvancada from "./pages/BuscaAvancada";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<PaginaInicial />} />
          <Route path="/livros" element={<Livros />} />
          <Route path="/emprestimos" element={<Emprestimos />} />
          <Route path="/configuracoes" element={<Configuracoes />} />
          <Route path="/categorias" element={<Categorias />} />
          <Route path="/editoras" element={<Editoras />} />
          <Route path="/usuarios" element={<Usuarios />} />
          <Route path="/autores" element={<Autores />} />
          <Route path="/exemplares" element={<Exemplares />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/buscaavancada" element={<BuscaAvancada />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
export default App;
