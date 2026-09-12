import axiosClient from "./axiosClient";

const tipoDocumentosApi = {
  list: () => axiosClient.get("/tipo-documentos"),
  getById: (id) => axiosClient.get(`/tipo-documentos/${id}`),
  create: (data) => axiosClient.post("/tipo-documentos", data),
  update: (id, data) => axiosClient.put(`/tipo-documentos/${id}`, data),
  remove: (id) => axiosClient.delete(`/tipo-documentos/${id}`),
};

export default tipoDocumentosApi;
