/* eslint-disable @typescript-eslint/no-explicit-any */
import instance from "./config";

const engineerStockApi = {
  transfer: (data: { list: any[] }) =>
    instance.post(`/engineer-stock/transfer`, data),
};

export default engineerStockApi;
