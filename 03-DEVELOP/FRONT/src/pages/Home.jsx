import { Link } from "react-router-dom";

export default function Home() {
  const isAuth = !!localStorage.getItem("accessToken");

  return (
    <div className="crud-page">
      <h1 className="crud-title">Inicio</h1>

      <div className="card">
        <p style={{ marginBottom: 16 }}>Bienvenido. Usa el menú superior para navegar.</p>

        {!isAuth ? (
          <div className="status-msg">
            No hay usuario en localStorage. Puedes{" "}
            <Link to="/login" style={{ color: "var(--primary)" }}>iniciar sesión</Link> o{" "}
            <Link to="/register" style={{ color: "var(--primary)" }}>registrarte</Link>.
          </div>
        ) : (
          <div className="status-msg">Sesión activa. Ya puedes usar los módulos del sistema.</div>
        )}
      </div>

      <div className="card">
        <div className="card-title">Accesos rápidos</div>
        <ul style={{ lineHeight: 2 }}>
          {!isAuth ? (
            <>
              <li><Link to="/login" style={{ color: "var(--primary)" }}>Ir a Login</Link></li>
              <li><Link to="/register" style={{ color: "var(--primary)" }}>Ir a Registro</Link></li>
            </>
          ) : (
            <>
              <li><Link to="/tipo-documentos" style={{ color: "var(--primary)" }}>Ir a Tipo Documentos</Link></li>
              <li><Link to="/roles" style={{ color: "var(--primary)" }}>Ir a Roles</Link></li>
              <li><Link to="/tipo-vehiculos" style={{ color: "var(--primary)" }}>Ir a Tipo Vehículos</Link></li>
              <li><Link to="/metodos" style={{ color: "var(--primary)" }}>Ir a Métodos</Link></li>
              <li><Link to="/estados-reserva" style={{ color: "var(--primary)" }}>Ir a Estados Reserva</Link></li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}
