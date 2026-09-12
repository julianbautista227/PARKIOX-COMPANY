import { Link } from "react-router-dom";

export default function Navbar() {
  const logout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
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
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <strong style={{ color: "#f2f3f5" }}>PARKIOX</strong>
      </div>

      <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
        <Link style={linkStyle} to="/tipo-documentos">Tipo Documentos</Link>
        <Link style={linkStyle} to="/roles">Roles</Link>
        <Link style={linkStyle} to="/tipo-vehiculos">Tipo Vehículos</Link>
        <Link style={linkStyle} to="/metodos">Métodos</Link>
        <Link style={linkStyle} to="/estados-reserva">Estados Reserva</Link>
      </div>

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
    </nav>
  );
}
