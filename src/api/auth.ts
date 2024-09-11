import instance from "./config";

const authApi = {
  login: (data: { login: string; password: string }) =>
    instance.post(`/auth/login`, data),
  verify: () => instance.post(`/auth/verify`),
};

export default authApi;
