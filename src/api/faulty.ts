import instance from "./config";

/* eslint-disable @typescript-eslint/no-explicit-any */
const faultyApi = {
  create: (data: { list: any[] }) => instance.post(`/faulty`, data),
  report: (from: string, to: string) =>
    instance.get(`/faulty/report?fromDate=${from}&toDate=${to}`),
  faultyAction: (
    id: string,
    data: { status: "received" | "rejected"; endReason: string }
  ) => instance.put(`/faulty/${id}`, data),
  headFaulty: () => instance.get(`/faulty/head-faulty`),
};

export default faultyApi;
