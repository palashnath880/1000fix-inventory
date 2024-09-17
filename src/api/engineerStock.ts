/* eslint-disable @typescript-eslint/no-explicit-any */
import instance from "./config";

const engineerStockApi = {
  transfer: (data: { list: any[] }) =>
    instance.post(`/engineer-stock/transfer`, data),
  receive: () => instance.get(`/engineer-stock/receive`),
  update: (id: string, data: any) =>
    instance.put(`/engineer-stock/${id}`, data),
};

export default engineerStockApi;
