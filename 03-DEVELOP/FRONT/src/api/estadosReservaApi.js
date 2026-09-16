// Cliente Axios configurado para realizar las peticiones HTTP de la aplicación.
import { axiosClient } from "./axiosClient";

// Operaciones disponibles para administrar los estados de las reservas.
const estadosReservaApi = {
  // Obtiene todos los estados de reserva registrados.
  list: () => axiosClient.get("/estados-reserva"),

  // Obtiene un estado de reserva específico mediante su identificador.
  getById: (id) => axiosClient.get(`/estados-reserva/${id}`),

  // Crea un nuevo estado de reserva con los datos proporcionados.
  create: (data) => axiosClient.post("/estados-reserva", data),

  // Actualiza un estado de reserva existente mediante su identificador.
  update: (id, data) => axiosClient.put(`/estados-reserva/${id}`, data),

  // Elimina un estado de reserva mediante su identificador.
  remove: (id) => axiosClient.delete(`/estados-reserva/${id}`),
};

// Exporta el cliente para que pueda utilizarse desde los componentes de la aplicación.
export default estadosReservaApi;
