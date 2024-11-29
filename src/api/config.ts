import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_APP_API_URL;

// axios instance
const instance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Add Access Token
instance.interceptors.request.use(
  (config) => {
    const token = Cookies.get("ac_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 Errors and Refresh Token
instance.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    if (error.response?.status === 401 && error?.config) {
      try {
        const { data } = await axios.post(
          `${API_URL}/auth/refresh-token`,
          {},
          {
            withCredentials: true,
          }
        );
        if (data?.ac_token && error?.config?.headers) {
          error.config.headers.Authorization = `Bearer ${data?.ac_token}`;
        }
        return instance.request(error.config);
      } catch {
        Cookies.remove("ac_token"); // remove access token
        Cookies.remove("re_token"); // remove refresh token
        toast.error(`Refresh token expired. Please log in again.`);
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
