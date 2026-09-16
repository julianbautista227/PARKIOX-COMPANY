import { axiosClient } from "./axiosClient";

// Agrupa las peticiones relacionadas con autenticacion del usuario.
const authApi = {
  // Envia correo y contrasena al backend para iniciar sesion.
  // Devuelve una promesa con el token y los datos del usuario.
  login: (data) => axiosClient.post("/login", data),

  // Envia correo y contrasena al backend para crear una cuenta.
  // El backend responde con el usuario registrado y un token.
  register: (data) => axiosClient.post("/register", data),
};

export default authApi;


//centraliza las peticiones relacionadas con autenticación: iniciar sesión y registrar usuarios
//Crea un objeto llamado authApi. Este objeto agrupa las operaciones de autenticación.