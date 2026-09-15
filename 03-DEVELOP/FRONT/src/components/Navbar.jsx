import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

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

  const linkStyle = {
    color: "#f2f3f5",
    textDecoration: "none",
    fontSize: "0.9rem",
  };

  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 24px",
        borderBottom: "1px solid #2a2f3a",
        fontFamily: "sans-serif",
        background: "#171a21",
        flexWrap: "wrap",
        gap: 12,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <strong style={{ color: "#f2f3f5" }}>PARKIOX</strong>
      </div>

      <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
        <Link style={linkStyle} to="/">Inicio</Link>

        {!isAuth && (
          <>
            <Link style={linkStyle} to="/login">Login</Link>
            <Link style={linkStyle} to="/register">Registro</Link>
          </>
        )}

        {isAuth && (
          <>
            <Link style={linkStyle} to="/tipo-documentos">Tipo Documentos</Link>
            <Link style={linkStyle} to="/roles">Roles</Link>
            <Link style={linkStyle} to="/tipo-vehiculos">Tipo Vehículos</Link>
            <Link style={linkStyle} to="/metodos">Métodos</Link>
            <Link style={linkStyle} to="/estados-reserva">Estados Reserva</Link>
          </>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ color: "#9aa1ac", fontSize: "0.85rem" }}>
          {isAuth ? "Autenticado" : "No autenticado"}
        </span>

        {isAuth && (
          <button
            onClick={logout}
            style={{
              background: "transparent",
              border: "1px solid #2a2f3a",
              color: "#f2f3f5",
              borderRadius: 8,
              padding: "6px 14px",
              cursor: "pointer",
            }}
          >
            Salir
          </button>
        )}
      </div>
    </nav>
  );
}
