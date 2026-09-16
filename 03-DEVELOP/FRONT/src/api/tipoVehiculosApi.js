// Cliente Axios configurado para realizar las peticiones HTTP de la aplicación.
import { axiosClient } from "./axiosClient";

// Operaciones disponibles para administrar los tipos de vehículo.
const tipoVehiculosApi = {
  // Obtiene todos los tipos de vehículo registrados.
  list: () => axiosClient.get("/tipo-vehiculos"),

  // Obtiene un tipo de vehículo específico mediante su identificador.
  getById: (id) => axiosClient.get(`/tipo-vehiculos/${id}`),

  // Crea un nuevo tipo de vehículo con los datos proporcionados.
  create: (data) => axiosClient.post("/tipo-vehiculos", data),

  // Actualiza un tipo de vehículo existente mediante su identificador.
  update: (id, data) => axiosClient.put(`/tipo-vehiculos/${id}`, data),

  // Elimina un tipo de vehículo mediante su identificador.
  remove: (id) => axiosClient.delete(`/tipo-vehiculos/${id}`),
};

// Exporta el cliente para que pueda utilizarse desde los componentes de la aplicación.
export default tipoVehiculosApi;
