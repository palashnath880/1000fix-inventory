/* eslint-disable @typescript-eslint/no-explicit-any */
import instance from "./config";

const engineerStockApi = {
  transfer: (data: { list: any[] }) =>
    instance.post(`/engineer-stock/transfer`, data),
  receive: () => instance.get(`/engineer-stock/receive`),
  update: (id: string, data: any) =>
    instance.put(`/engineer-stock/${id}`, data),
  stock: (skuId: string) => instance.get(`/engineer-stock/own?skuId=${skuId}`),
  stockBySku: (userId: string, skuId: string) =>
    instance.get(`/engineer-stock/get-by-sku/${userId}/${skuId}`),
  faultyReturn: (data: any) =>
    instance.post(`/engineer-stock/faulty-return`, data),
};

export default engineerStockApi;
