import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import TipoDocumentosCrud from "./pages/TipoDocumentosCrud";
import RolesCrud from "./pages/RolesCrud";
import TipoVehiculosCrud from "./pages/TipoVehiculosCrud";
import MetodosCrud from "./pages/MetodosCrud";
import EstadosReservaCrud from "./pages/EstadosReservaCrud";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/tipo-documentos" element={<TipoDocumentosCrud />} />
        <Route path="/roles" element={<RolesCrud />} />
        <Route path="/tipo-vehiculos" element={<TipoVehiculosCrud />} />
        <Route path="/metodos" element={<MetodosCrud />} />
        <Route path="/estados-reserva" element={<EstadosReservaCrud />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
