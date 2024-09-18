import instance from "./config";

const authApi = {
  login: (data: { login: string; password: string }) =>
    instance.post(`/auth/login`, data),
  verify: () => instance.post(`/auth/user`),
  changePwd: (data: { prev: string; new: string }) =>
    instance.post(`/auth/change-password`, data),
};

export default authApi;
