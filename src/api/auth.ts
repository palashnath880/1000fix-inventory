import instance from "./config";

const authApi = {
  login: (data: { login: string; password: string }) =>
    instance.post(`/auth/login`, data),
  changePwd: (data: { prev: string; new: string }) =>
    instance.post(`/auth/change-password`, data),
  sendLink: (login: string) =>
    instance.post(`/auth/send-reset-link`, { login }),
  updateResetPwd: (data: { password: string; tokenId: string }) =>
    instance.post(`/auth/update-reset-pwd`, data),
  refresh: () =>
    instance.post(`/auth/refresh-token`, {}, { withCredentials: true }),
};

export default authApi;
