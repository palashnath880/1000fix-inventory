import instance from "./config";

const reportApi = {
  scrap: (from: string, to: string) =>
    instance.get(`/report/scrap?fromDate=${from}&toDate=${to}`),
  enReReport: (type: "return" | "faulty", from: string, to: string) =>
    instance.get(
      `/report/en-return-report/${type}?fromDate=${from}&toDate=${to}`
    ),
  getAgingReport: (skuId: string) =>
    instance.get(`/report/aging?skuId=${skuId}`),
};

export default reportApi;
