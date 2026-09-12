import { axiosClient } from "./axiosClient";
// Importa la instancia de Axios ya configurada para reutilizar
// la conexión con el servidor y la estructura base de la API.

export const rolApi = {
  // Obtiene la lista completa de roles.
  list: () => axiosClient.get("/roles"),

  // Consulta un rol específico según su identificador.
  getById: (id) => axiosClient.get(`/roles/${id}`),

  // Registra un nuevo rol en el sistema.
  create: (data) => axiosClient.post("/roles", data),

  // Actualiza la información de un rol existente.
  update: (id, data) => axiosClient.put(`/roles/${id}`, data),

  // Elimina un rol según su ID.
  remove: (id) => axiosClient.delete(`/roles/${id}`),
};