import instance from "./config";

const branchApi = {
  create: (data: { name: string; address: string }) =>
    instance.post(`/branch`, data),
  get: (search: string = "") => instance.get(`/branch?search=${search}`),
  update: (id: string, data: { address: string; users: string[] }) =>
    instance.put(`/branch/${id}`, data),
  delete: (id: string) => instance.delete(`/branch/${id}`),
};

export default branchApi;
