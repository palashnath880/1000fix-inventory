import axios from "axios";
import Cookies from "js-cookie";

const instance = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL,
  headers: {
    Authorization:
      Cookies.get("auth_token") && `Bearer ${Cookies.get("auth_token")}`,
    "Content-Type": "application/json",
  },
});

export default instance;
