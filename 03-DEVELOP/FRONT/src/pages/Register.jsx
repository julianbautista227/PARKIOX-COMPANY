import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import authApi from "../api/authApi";

export default function Register() {
  // Estados controlados por el formulario y por el proceso de registro.
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    // Evita la recarga automatica de la pagina.
    e.preventDefault();
    setError("");

    // Comprueba localmente que las dos contrasenas sean iguales.
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);
    try {
      // Envia al backend solo los datos necesarios para crear la cuenta.
      const res = await authApi.register({ email, password });

      // El backend devuelve la sesion creada y el token de acceso.
      const { accessToken, user } = res.data;

      // Guarda la sesion para usarla en las siguientes peticiones.
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("user", JSON.stringify(user));

      // Redirige al usuario una vez finalizado el registro.
      navigate("/tipo-documentos");
    } catch (err) {
      // Obtiene un mensaje util para mostrarlo en el formulario.
      const msg =
        err?.response?.data?.message ||
        err?.response?.statusText ||
        err?.message ||
        "Error desconocido";
      setError(msg);
    } finally {
      // Quita el indicador de carga en cualquier resultado.
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-box">
        <Link to="/" className="back-link">← Volver al Inicio</Link>

        <div className="brand-block">
          <h1 className="brand-title">PARKIOX</h1>
          <p className="brand-subtitle">Crea tu cuenta</p>
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
              <label>Contraseña</label>
              <input
                className="input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                required
              />
            </div>

            <div className="field">
              <label>Confirmar contraseña</label>
              <input
                className="input"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                required
              />
            </div>

            {error && <div className="status-msg status-error">{error}</div>}

            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? "Creando cuenta..." : "Registrarme"}
            </button>
          </form>

          <div className="status-msg" style={{ marginTop: 16, textAlign: "center" }}>
            ¿Ya tienes cuenta? <Link to="/login" className="link-inline">Inicia sesión</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
