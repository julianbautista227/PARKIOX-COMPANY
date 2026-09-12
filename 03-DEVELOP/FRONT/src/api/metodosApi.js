import { axiosClient } from "./axiosClient";
// Importa la instancia de Axios ya configurada para reutilizar
// la conexión con el servidor y la estructura base de la API.

export const metodosApi = {
  // Obtiene la lista completa de métodos de pago.
  list: () => axiosClient.get("/metodos"),

  // Consulta un método de pago específico según su identificador.
  getById: (id) => axiosClient.get(`/metodos/${id}`),

  // Registra un nuevo método de pago en el sistema.
  create: (data) => axiosClient.post("/metodos", data),

  // Actualiza la información de un método de pago existente.
  update: (id, data) => axiosClient.put(`/metodos/${id}`, data),

  // Elimina un método de pago según su ID.
  remove: (id) => axiosClient.delete(`/metodos/${id}`),
};  