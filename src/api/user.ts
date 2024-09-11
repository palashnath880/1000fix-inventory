import instance from "./config";

const userApi = {
  create: (data: { name: string; email: string; role: string }) =>
    instance.post(`/user`, data),
  get: (search: string = "") => instance.get(`/user?search=${search}`),
};

export default userApi;
