import instance from "./config";

const uomApi = {
  create: (data: { name: string }) => instance.post(`/uom`, data),
  get: () => instance.get(`/uom`),
  delete: (Id: string) => instance.delete(`/uom/${Id}`),
};

export default uomApi;
