import instance from "./config";

const categoryApi = {
  create: (data: { name: string }) => instance.post(`/category`, data),
  get: () => instance.get(`/category`),
  delete: (Id: string) => instance.delete(`/category/${Id}`),
};

export default categoryApi;
