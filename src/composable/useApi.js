import axios from "axios";
import { hasToken, getToken } from "@/composable/useAuth";

const Api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL + '/sweet-home/v1',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
});

Api.interceptors.request.use(function (config) {
  if (!hasToken()) {
    return config;
  }
  const token = "Bearer " + getToken();

  if (
    !config.headers.hasOwnProperty("Authorization") &&
    config.headers.Authorization !== token
  ) {
    config.headers.Authorization = token;
  }

  return config;
});

export default Api;
