// Este archivo configura una instancia reutilizable de Axios para gestionar
// todas las solicitudes HTTP del frontend hacia el backend.
// La utilidad de esta instancia es centralizar la definición de la URL base,
// los encabezados por defecto y la autenticación, evitando repetir
// configuración en cada petición del proyecto.

import axios from "axios";
// Importa la librería Axios, que permite realizar peticiones HTTP
// (GET, POST, PUT, DELETE, etc.) desde aplicaciones frontend.
// Axios facilita el manejo de respuestas, errores y configuración global.

import axios from "axios"; // Importa la librería Axios

// Crea una instancia personalizada de Axios mediante axios.create().
// Esto permite definir valores por defecto para todas las llamadas
// realizadas desde este clientee, manteniendo un código más limpio
// y reutilizable en toda la aplicación.
export const axiosClient = axios.create({
  baseURL: "http://localhost:3000/", 
  // Establece la URL base del servidor backend.
  // Todas las peticiones que se hagan con esta instancia partirán de esta dirección.
  // Por ejemplo, si se llama a "/productos", la petición real será:
  // http://localhost:3000/productos

  headers: {
    "Content-Type": "application/json",
    // Define el tipo de contenido que se enviará en las peticiones.
    // application/json indica que los datos están en formato JSON,
    // que es el formato estándar para intercambiar información con APIs REST.
  },
});

// Se agrega un interceptor de solicitudes para ejecutar lógica
// antes de que cada petición sea enviada al servidor.
// El objetivo es automatizar la inclusión del token de autenticación
// en todas las solicitudes que lo requieran.
axiosClient.interceptors.request.use((config) => {
  // 'config' contiene la configuración completa de la petición actual
  // (URL, método, headers, body, entre otros).

  const token = localStorage.getItem("accessToken");
  // Accede al almacenamiento local del navegador para obtener el token
  // de acceso guardado durante el inicio de sesión.
  // Este token normalmente se almacena en el navegador para mantener
  // la sesión del usuario autenticado.

  if (token) config.headers.Authorization = `Bearer ${token}`;
  // Si existe un token válido, se agrega la cabecera Authorization
  // con el formato Bearer <token>.
  // Este tipo de autenticación es usado por APIs REST para validar
  // que el usuario está autenticado al momento de hacer la solicitud.

  return config;
  // Devuelve la configuración final de la petición con el token incluido.
  // Este valor será enviado al servidor con la solicitud HTTP.
});



/*

import axios from "axios";

export const axiosClient = axios.create({
  baseURL: "http://localhost:3000/",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}); 

*/