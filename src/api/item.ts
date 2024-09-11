import instance from "./config";

const itemApi = {
  create: (data: { name: string; uom: string; modelId: string }) =>
    instance.post(`/item`, data),
  get: () => instance.get(`/item`),
  delete: (Id: string) => instance.delete(`/item/${Id}`),
};

export default itemApi;
