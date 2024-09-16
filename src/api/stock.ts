/* eslint-disable @typescript-eslint/no-explicit-any */
import instance from "./config";

const stockApi = {
  entry: (data: any) => instance.post(`/stock/entry`, data),
  entryList: (from: string, to: string) =>
    instance.get(`/stock/entry?fromDate=${from}&toDate=${to}`),
  ownStock: (category: string, model: string, skuCode: string) =>
    instance.get(
      `/stock/own?category=${category}&model=${model}&skuCode=${skuCode}`
    ),
  getBySkuId: (skuId: string) =>
    instance.get(`/stock/get-by-sku?skuCodeId=${skuId}`),
  transfer: (data: any) => instance.post(`/stock/transfer`, data),
  return: (data: any) => instance.post(`/stock/return`, data),
  transferList: (from: string, to: string) =>
    instance.get(`/stock/transfer?fromDate=${from}&toDate=${to}`),
  receiveList: () => instance.get(`/stock/receive`),
  statusUpdate: (Id: string, data: any) =>
    instance.put(`/stock/status/${Id}`, data),
  approval: () => instance.get(`/stock/approval`),
};

export default stockApi;
