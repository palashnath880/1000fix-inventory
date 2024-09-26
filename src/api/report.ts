import instance from "./config";

const reportApi = {
  scrap: (from: string, to: string) =>
    instance.get(`/report/scrap?fromDate=${from}&toDate=${to}`),
};

export default reportApi;
