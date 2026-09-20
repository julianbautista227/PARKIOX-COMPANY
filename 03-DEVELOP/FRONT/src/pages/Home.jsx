// Permite crear enlaces internos sin recargar toda la aplicación.
import { Link } from "react-router-dom";
// Importa la imagen de marca que se muestra en las vistas principales.
import logo from "../assets/logo.png";

// Información que se utiliza para construir las tarjetas de beneficios.
const FEATURES = [
  { emoji: "🔍", title: "búsqueda fácil", desc: "encuentra en segundos, sin dolores de cabeza" },
  { emoji: "🛡️", title: "seguro", desc: "parqueaderos verificados, no te preocupes" },
  { emoji: "💳", title: "paga con PSE", desc: "fácil, rápido, sin efectivo" },
  { emoji: "⚡", title: "reserva ya", desc: "confirmas en segundos, no en horas" },
];

/**
 * Página pública que se muestra cuando el usuario todavía no ha iniciado sesión.
 * Presenta la propuesta de valor de Parkiox y enlaces para entrar o registrarse.
 */
function Landing() {
  // Agrupa las secciones principales de la página pública.
  return (
    <>
      {/* Sección principal con el mensaje y las acciones de acceso. */}
      <section className="hero-section">
        {/* Texto decorativo de fondo asociado a la marca. */}
        <div className="hero-watermark" aria-hidden="true">PARKIOX</div>

        {/* Distribuye el contenido textual y la imagen en dos áreas. */}
        <div className="hero-flex">
          <div className="hero-text">
            {/* Mensaje introductorio y descripción del servicio. */}
            <p className="hero-eyebrow">oye, ¿buscas dónde parquear?</p>
            <h1 className="hero-title">parquea sin complicaciones</h1>
            <p className="hero-desc">
              encuentra parqueadero cerca, reserva rápido y listo. sin vueltas.
            </p>

            {/* Enlaces para iniciar sesión o crear una cuenta. */}
            <div className="hero-buttons">
              <Link to="/login" className="btn-primary">buscar parqueadero</Link>
              <Link to="/register" className="btn-outline">registrarme</Link>
            </div>
          </div>

          <div className="hero-visual">
            {/* Imagen principal de la marca. */}
            <img src={logo} alt="Parkiox" />
          </div>
        </div>
      </section>

      {/* Sección que resume las ventajas principales del sistema. */}
      <section className="why-section">
        <h2 className="section-title">¿por qué PARKIOX?</h2>
        <p className="section-subtitle">básicamente porque es fácil</p>

        {/* Genera una tarjeta por cada elemento definido en FEATURES. */}
        <div className="features-grid">
          {FEATURES.map((f) => (
            <div className="feature-card" key={f.title}>
              <div className="feature-emoji">{f.emoji}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

// Enlaces rápidos que se muestran a los usuarios autenticados.
const QUICK_LINKS = [
  { to: "/tipo-documentos", emoji: "🪪", title: "Tipo Documentos", desc: "Gestiona las cédulas, TI y demás documentos válidos" },
  { to: "/tipo-vehiculos", emoji: "🚗", title: "Tipo Vehículos", desc: "Administra las categorías de vehículos aceptadas" },
  { to: "/metodos", emoji: "💳", title: "Métodos", desc: "Configura los métodos de pago disponibles" },
  { to: "/estados-reserva", emoji: "📋", title: "Estados Reserva", desc: "Consulta los estados posibles de una reserva" },
];

/**
 * Panel principal para usuarios autenticados.
 * Muestra los módulos administrativos disponibles en el sistema.
 */
function Dashboard() {
  // Organiza el logo, el mensaje de bienvenida y los accesos a los módulos.
  return (
    <div className="crud-page">
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        {/* Identidad visual y confirmación de que la sesión está activa. */}
        <img src={logo} alt="Parkiox" className="dashboard-logo-img" />
        <h1 className="crud-title">Bienvenido de nuevo</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
          Sesión activa. Estos son los módulos disponibles del sistema.
        </p>
      </div>

      {/* Genera un enlace visual para cada módulo disponible. */}
      <div className="dashboard-grid">
        {QUICK_LINKS.map((l) => (
          <Link to={l.to} className="dashboard-card" key={l.to}>
            <div className="dashboard-card-emoji">{l.emoji}</div>
            <h3>{l.title}</h3>
            <p>{l.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

/**
 * Decide qué vista debe mostrarse en la ruta principal.
 * Usa el token almacenado en el navegador para identificar una sesión activa.
 */
export default function Home() {
  // La conversión a booleano transforma el token existente en true o false.
  const isAuth = !!localStorage.getItem("accessToken");

  // Los usuarios autenticados ven el panel; los demás ven la página pública.
  return isAuth ? <Dashboard /> : <Landing />;
}
