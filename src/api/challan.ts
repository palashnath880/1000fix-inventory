import instance from "./config";

const challanApi = {
  create: (data: unknown) => instance.post(`/challan`, data),
  getAll: (fromDate: string, toDate: string) =>
    instance.get(`/challan?fromDate=${fromDate}&toDate=${toDate}`),
  getById: (id: string) => instance.get(`/challan/${id}`),
  delete: (id: string) => instance.delete(`/challan/${id}`),
};

export default challanApi;
