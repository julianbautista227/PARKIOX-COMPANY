// Componentes necesarios para configurar la navegación de la aplicación.
import { BrowserRouter, Routes, Route } from "react-router-dom";
// Barra de navegación visible en las páginas principales.
import Navbar from "./components/Navbar";
// Páginas públicas y módulos CRUD del sistema.
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import TipoDocumentosCrud from "./pages/TipoDocumentosCrud";
import TipoVehiculosCrud from "./pages/TipoVehiculosCrud";
import MetodosCrud from "./pages/MetodosCrud";
import EstadosReservaCrud from "./pages/EstadosReservaCrud";

/**
 * Componente raíz de Parkiox.
 * Configura el enrutamiento y relaciona cada URL con su página.
 */
function App() {
  // BrowserRouter permite navegar entre vistas sin recargar el navegador.
  return (
    <BrowserRouter>
      {/* La barra se mantiene visible mientras cambia la ruta. */}
      <Navbar />
      {/* Routes selecciona la vista que coincide con la URL actual. */}
      <Routes>
        {/* Página inicial pública o panel del usuario autenticado. */}
        <Route path="/" element={<Home />} />
        {/* Rutas de autenticación. */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Rutas para administrar la información maestra del sistema. */}
        <Route path="/tipo-documentos" element={<TipoDocumentosCrud />} />
        <Route path="/tipo-vehiculos" element={<TipoVehiculosCrud />} />
        <Route path="/metodos" element={<MetodosCrud />} />
        <Route path="/estados-reserva" element={<EstadosReservaCrud />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
