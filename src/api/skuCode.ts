import instance from "./config";

const skuCodeApi = {
  create: (data: { name: string; itemId: string; isDefective: boolean }) =>
    instance.post(`/sku-code`, data),
  get: (search: string = "") => instance.get(`/sku-code?search=${search}`),
  delete: (id: string) => instance.delete(`/sku-code/${id}`),
};

export default skuCodeApi;
