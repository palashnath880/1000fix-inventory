import instance from "./config";

const challanApi = {
  create: (data: unknown) => instance.post(`/challan`, data),
  getAll: (search: string, fromDate: string, toDate: string) =>
    instance.get(
      `/challan?search=${search}&fromDate=${fromDate}&toDate=${toDate}`
    ),
  getById: (id: string) => instance.get(`/challan/${id}`),
  delete: (id: string) => instance.delete(`/challan/${id}`),
};

export default challanApi;
