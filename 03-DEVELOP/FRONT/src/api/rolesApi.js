import axiosClient from "./axiosClient";

const rolesApi = {
  list: () => axiosClient.get("/roles"),
  getById: (id) => axiosClient.get(`/roles/${id}`),
  create: (data) => axiosClient.post("/roles", data),
  update: (id, data) => axiosClient.put(`/roles/${id}`, data),
  remove: (id) => axiosClient.delete(`/roles/${id}`),
};

export default rolesApi;
