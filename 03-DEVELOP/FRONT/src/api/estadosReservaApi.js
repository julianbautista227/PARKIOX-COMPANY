import axiosClient from "./axiosClient";

const estadosReservaApi = {
  list: () => axiosClient.get("/estados-reserva"),
  getById: (id) => axiosClient.get(`/estados-reserva/${id}`),
  create: (data) => axiosClient.post("/estados-reserva", data),
  update: (id, data) => axiosClient.put(`/estados-reserva/${id}`, data),
  remove: (id) => axiosClient.delete(`/estados-reserva/${id}`),
};

export default estadosReservaApi;
