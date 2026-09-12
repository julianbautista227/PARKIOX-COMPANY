import axiosClient from "./axiosClient";

const metodosApi = {
  list: () => axiosClient.get("/metodos"),
  getById: (id) => axiosClient.get(`/metodos/${id}`),
  create: (data) => axiosClient.post("/metodos", data),
  update: (id, data) => axiosClient.put(`/metodos/${id}`, data),
  remove: (id) => axiosClient.delete(`/metodos/${id}`),
};

export default metodosApi;
