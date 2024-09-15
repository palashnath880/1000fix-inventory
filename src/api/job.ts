/* eslint-disable @typescript-eslint/no-explicit-any */
import instance from "./config";

const jobApi = {
  create: (data: any) => instance.post(`/job`, data),
  branchList: (from: string, to: string) =>
    instance.get(`/job/list?fromDate=${from}&toDate=${to}`),
};

export default jobApi;
