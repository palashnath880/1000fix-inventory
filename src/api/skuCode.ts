/* eslint-disable @typescript-eslint/no-explicit-any */
import instance from "./config";

const skuCodeApi = {
  create: (data: { name: string; itemId: string; isDefective: boolean }) =>
    instance.post(`/sku-code`, data),
  get: (search: string = "") => instance.get(`/sku-code?search=${search}`),
  delete: (id: string) => instance.delete(`/sku-code/${id}`),
  update: (id: string, data: any) => instance.put(`/sku-code/${id}`, data),
};

export default skuCodeApi;
