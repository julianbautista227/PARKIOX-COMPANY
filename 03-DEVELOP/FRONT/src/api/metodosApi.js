
// Cliente Axios configurado para realizar las peticiones HTTP de la aplicación.
import { axiosClient } from "./axiosClient";

// Operaciones disponibles para administrar los métodos de pago.
const metodosApi = {
  // Obtiene todos los métodos de pago registrados.
  list: () => axiosClient.get("/metodos"),

  // Obtiene un método de pago específico mediante su identificador.
  getById: (id) => axiosClient.get(`/metodos/${id}`),

  // Crea un nuevo método de pago con los datos proporcionados.
  create: (data) => axiosClient.post("/metodos", data),

  // Actualiza un método de pago existente mediante su identificador.
  update: (id, data) => axiosClient.put(`/metodos/${id}`, data),

  // Elimina un método de pago mediante su identificador.
  remove: (id) => axiosClient.delete(`/metodos/${id}`),
};

// Exporta el cliente para que pueda utilizarse desde los componentes de la aplicación.
export default metodosApi;
