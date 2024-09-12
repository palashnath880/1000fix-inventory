/* eslint-disable @typescript-eslint/no-explicit-any */
import instance from "./config";

const stockApi = {
  entry: (data: any) => instance.post(`/stock/entry`, data),
  entryList: (from: string, to: string) =>
    instance.get(`/stock/entry?fromDate=${from}&toDate=${to}`),
};

export default stockApi;
