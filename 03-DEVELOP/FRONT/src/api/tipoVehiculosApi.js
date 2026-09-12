import axiosClient from "./axiosClient";

const tipoVehiculosApi = {
  list: () => axiosClient.get("/tipo-vehiculos"),
  getById: (id) => axiosClient.get(`/tipo-vehiculos/${id}`),
  create: (data) => axiosClient.post("/tipo-vehiculos", data),
  update: (id, data) => axiosClient.put(`/tipo-vehiculos/${id}`, data),
  remove: (id) => axiosClient.delete(`/tipo-vehiculos/${id}`),
};

export default tipoVehiculosApi;
