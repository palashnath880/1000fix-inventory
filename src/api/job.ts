/* eslint-disable @typescript-eslint/no-explicit-any */
import instance from "./config";

const jobApi = {
  create: (data: any) => instance.post(`/job`, data),
  branchList: (search: string) => instance.get(`/job/list?${search}`),
  summary: (search: string) => instance.get(`/job/summary?${search}`),
  graph: (month: number) => instance.get(`/job/graph?month=${month}`),
};

export default jobApi;
