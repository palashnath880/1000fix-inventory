import instance from "./config";

const branchApi = {
  create: (data: { name: string; address: string }) =>
    instance.post(`/branch`, data),
  get: (search: string = "") => instance.get(`/branch?search=${search}`),
};

export default branchApi;
