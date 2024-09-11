import instance from "./config";

const modelApi = {
  create: (data: { name: string; category: string }) =>
    instance.post(`/model`, data),
  get: () => instance.get(`/model`),
  delete: (Id: string) => instance.delete(`/model/${Id}`),
};

export default modelApi;
