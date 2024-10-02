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
  branchStock: (branch: string, cate: string, model: string, sku: string) =>
    instance.get(
      `/stock/branch?branch=${branch}&category=${cate}&model=${model}&skuCode=${sku}`
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
  getDefective: (cate: string, model: string, sku: string) =>
    instance.get(
      `/stock/defective?category=${cate}&model=${model}&skuCode=${sku}`
    ),
  moveToScrap: (data: { list: { quantity: number; skuCodeId: string }[] }) =>
    instance.post(`/stock/scrap`, data),
  sendDefective: (data: { list: { quantity: number; skuCodeId: string }[] }) =>
    instance.post(`/stock/defective-send`, data),
  moveToStock: (data: { list: { skuCodeId: string; quantity: number }[] }) =>
    instance.post(`/stock/faulty-to-good`, data),
  purchaseReturn: (data: any) => instance.post(`/stock/purchase-return`, data),
  puReturnList: (from: string, to: string) =>
    instance.get(`/stock/purchase-return?fromDate=${from}&toDate=${to}`),
  // faulty apis
  sendFaulty: (data: any) => instance.post(`/stock/faulty`, data),
  faultyReport: (from: string, to: string) =>
    instance.get(`/stock/faulty/report?fromDate=${from}&toDate=${to}`),
  faultyAction: (
    id: string,
    data: { status: "received" | "rejected"; note: string }
  ) => instance.put(`/stock/faulty/${id}`, data),
  cscSentFaulty: () => instance.get(`/stock/faulty`),
};

export default stockApi;
