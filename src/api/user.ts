import instance from "./config";

const userApi = {
  create: (data: { name: string; email: string; role: string }) =>
    instance.post(`/user`, data),
  get: (search: string = "") => instance.get(`/user?search=${search}`),
  delete: (id: string) => instance.delete(`/user/${id}`),
};

export default userApi;
