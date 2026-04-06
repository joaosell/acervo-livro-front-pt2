import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Livros from "./pages/Livros";
import Layout from "./components/Layout";
import Emprestimos from "./pages/Emprestimos";
import Configuracoes from "./pages/Configuracoes";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<Layout />}>
          <Route path="/livros" element={<Livros />} />
          <Route path="/emprestimos" element={<Emprestimos />} />
          <Route path="/configuracoes" element={<Configuracoes />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
export default App;
