import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import authApi from "../api/authApi";

export default function Login() {
  // Estados controlados por los campos y por el proceso de autenticacion.
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    // Evita que el navegador recargue la pagina al enviar el formulario.
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Envia las credenciales al endpoint /login mediante authApi.
      const res = await authApi.login({ email, password });

      // Extrae el token y los datos del usuario que devuelve el backend.
      const { accessToken, user } = res.data;

      // Guarda la sesion en el navegador para conservar el acceso.
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("user", JSON.stringify(user));

      // Lleva al usuario a una pagina protegida despues del login.
      navigate("/tipo-documentos");
    } catch (err) {
      // Muestra el mensaje mas especifico disponible si la peticion falla.
      const msg =
        err?.response?.data?.message ||
        err?.response?.statusText ||
        err?.message ||
        "Error desconocido";
      setError(msg);
    } finally {
      // Finaliza el estado de carga tanto si hay exito como si hay error.
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-box">
        <Link to="/" className="back-link">← Volver al Inicio</Link>

        <div className="brand-block">
          <h1 className="brand-title">PARKIOX</h1>
          <p className="brand-subtitle">Inicia sesión en tu cuenta</p>
        </div>

        <div className="card auth-card">
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div className="field">
              <label>Correo electrónico</label>
              <input
                className="input"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>

            <div className="field">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <label>Contraseña</label>
              </div>
              <input
                className="input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>

            {error && <div className="status-msg status-error">{error}</div>}

            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? "Entrando..." : "Iniciar Sesión"}
            </button>
          </form>

          <div className="status-msg" style={{ marginTop: 16, textAlign: "center" }}>
            ¿No tienes cuenta? <Link to="/register" className="link-inline">Regístrate</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
