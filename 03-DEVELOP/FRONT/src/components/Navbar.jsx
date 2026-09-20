import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import logo from "../assets/logo.png";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem("accessToken"));

  useEffect(() => {
    setIsAuth(!!localStorage.getItem("accessToken"));
  }, [location]);

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    setIsAuth(false);
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <img src={logo} alt="Parkiox" className="brand-logo-img" />
        <span className="navbar-brand-text">PARKIOX</span>
      </Link>

      <div className="navbar-links">
        <NavLink
          to="/"
          end
          className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
        >
          Inicio
        </NavLink>

        {isAuth && (
          <>
            <NavLink to="/tipo-documentos" className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}>
              Tipo Documentos
            </NavLink>
            <NavLink to="/tipo-vehiculos" className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}>
              Tipo Vehículos
            </NavLink>
            <NavLink to="/metodos" className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}>
              Métodos
            </NavLink>
            <NavLink to="/estados-reserva" className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}>
              Estados Reserva
            </NavLink>
          </>
        )}
      </div>

      <div className="navbar-actions">
        <span className="navbar-status">
          <span className={`status-dot${isAuth ? " online" : ""}`} />
          {isAuth ? "Autenticado" : "No autenticado"}
        </span>

        {!isAuth ? (
          <>
            <Link to="/login" className="btn-outline btn-sm">Iniciar Sesión</Link>
            <Link to="/register" className="btn-primary btn-sm">Registrarse</Link>
          </>
        ) : (
          <button onClick={logout} className="btn-outline btn-sm">
            Salir
          </button>
        )}
      </div>
    </nav>
  );
}
