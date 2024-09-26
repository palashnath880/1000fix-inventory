/* eslint-disable @typescript-eslint/no-explicit-any */
import instance from "./config";

const engineerStockApi = {
  transfer: (data: { list: any[] }) =>
    instance.post(`/engineer-stock/transfer`, data),
  // transfer report by branch
  trReportByBr: (id: string, from: string, to: string) =>
    instance.get(
      `/engineer-stock/transfer/?userId=${id}&fromDate=${from}&toDate=${to}`
    ),
  receive: () => instance.get(`/engineer-stock/receive`),
  update: (id: string, data: any) =>
    instance.put(`/engineer-stock/${id}`, data),
  stock: (skuId: string) => instance.get(`/engineer-stock/own?skuId=${skuId}`),
  stockReport: (userId: string, from: string, to: string) =>
    instance.get(
      `/engineer-stock/receive-report/${userId}?fromDate=${from}&toDate=${to}`
    ),
  stockBySku: (userId: string, skuId: string) =>
    instance.get(`/engineer-stock/get-by-sku/${userId}/${skuId}`),
  return: (data: any) => instance.post(`/engineer-stock/return`, data),
  returnStockByBranch: (type: "return" | "faulty") =>
    instance.get(`/engineer-stock/return-stock/${type}`),
  faultyReturn: (data: any) =>
    instance.post(`/engineer-stock/faulty-return`, data),
  report: (
    type: "return" | "faulty",
    userId: string,
    from: string,
    to: string
  ) =>
    instance.get(
      `/engineer-stock/report/${userId}?type=${type}&fromDate=${from}&toDate=${to}`
    ),
  getEnStock: ({
    category,
    id,
    model,
    skuId,
  }: {
    id: string;
    model: string;
    skuId: string;
    category: string;
  }) =>
    instance.get(
      `/engineer-stock/${id}?model=${model}&category=${category}&sku=${skuId}`
    ),
};

export default engineerStockApi;
