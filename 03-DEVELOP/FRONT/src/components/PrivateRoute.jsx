import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  // La existencia del token indica que hay una sesion guardada.
  const token = localStorage.getItem("accessToken");

  if (!token) {
    // Sin token, el usuario no puede acceder a la ruta protegida.
    return <Navigate to="/login" replace />;
  }

  // Con token, muestra el contenido de la ruta protegida.
  return children;
}
