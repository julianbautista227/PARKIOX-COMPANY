import { axiosClient } from "./axiosClient";
// Importa la instancia de Axios ya configurada para reutilizar
// la conexión con el servidor y la estructura base de la API.

export const tipoVehiculoApi = {
  // Obtiene la lista completa de tipos de vehículo.
  list: () => axiosClient.get("/tipo-vehiculos"),

  // Consulta un tipo de vehículo específico según su identificador.
  getById: (id) => axiosClient.get(`/tipo-vehiculos/${id}`),

  // Registra un nuevo tipo de vehículo en el sistema.
  create: (data) => axiosClient.post("/tipo-vehiculos", data),

  // Actualiza la información de un tipo de vehículo existente.
  update: (id, data) => axiosClient.put(`/tipo-vehiculos/${id}`, data),

  // Elimina un tipo de vehículo según su ID.
  remove: (id) => axiosClient.delete(`/tipo-vehiculos/${id}`),
};