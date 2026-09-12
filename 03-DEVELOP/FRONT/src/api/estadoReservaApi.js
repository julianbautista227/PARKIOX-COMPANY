import { axiosClient } from "./axiosClient";
// Importa la instancia de Axios ya configurada para reutilizar
// la conexión con el servidor y la estructura base de la API.

export const estadoReservaApi = {
  // Obtiene la lista completa de estados de reserva.
  list: () => axiosClient.get("/estados-reserva"),

  // Consulta un estado de reserva específico según su identificador.
  getById: (id) => axiosClient.get(`/estados-reserva/${id}`),

  // Registra un nuevo estado de reserva en el sistema.
  create: (data) => axiosClient.post("/estados-reserva", data),

  // Actualiza la información de un estado de reserva existente.
  update: (id, data) => axiosClient.put(`/estados-reserva/${id}`, data),

  // Elimina un estado de reserva según su ID.
  remove: (id) => axiosClient.delete(`/estados-reserva/${id}`),
};