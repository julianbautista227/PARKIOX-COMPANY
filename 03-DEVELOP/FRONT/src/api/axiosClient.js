import axios from "axios";

// Instancia reutilizable de Axios para comunicarse con el backend.
export const axiosClient = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Se ejecuta antes de enviar cada peticion realizada con axiosClient.
axiosClient.interceptors.request.use((config) => {
  // Recupera el token guardado despues de iniciar sesion o registrarse.
  const token = localStorage.getItem("accessToken");

  // Si existe un token, lo envia para identificar al usuario.
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Devuelve la configuracion para que Axios envie la peticion.
  return config;
});


