// Cliente Axios configurado para realizar las peticiones HTTP de la aplicación.
import { axiosClient } from "./axiosClient";

// Operaciones disponibles para administrar los tipos de documento.
const tipoDocumentosApi = {
  // Obtiene todos los tipos de documento registrados.
  list: () => axiosClient.get("/tipo-documentos"),

  // Obtiene un tipo de documento específico mediante su identificador.
  getById: (id) => axiosClient.get(`/tipo-documentos/${id}`),

  // Crea un nuevo tipo de documento con los datos proporcionados.
  create: (data) => axiosClient.post("/tipo-documentos", data),

  // Actualiza un tipo de documento existente mediante su identificador.
  update: (id, data) => axiosClient.put(`/tipo-documentos/${id}`, data),

  // Elimina un tipo de documento mediante su identificador.
  remove: (id) => axiosClient.delete(`/tipo-documentos/${id}`),
};

// Exporta el cliente para que pueda utilizarse desde los componentes de la aplicación.
export default tipoDocumentosApi;
