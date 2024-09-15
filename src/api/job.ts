/* eslint-disable @typescript-eslint/no-explicit-any */
import instance from "./config";

const jobApi = {
  create: (data: any) => instance.post(`/job`, data),
};

export default jobApi;
