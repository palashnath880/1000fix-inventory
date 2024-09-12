/* eslint-disable @typescript-eslint/no-explicit-any */
import instance from "./config";

const stockApi = {
  entry: (data: any) => instance.post(`/stock/entry`, data),
};

export default stockApi;
