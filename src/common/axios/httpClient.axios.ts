import axios, { AxiosResponse } from "axios";
import { useAuthStore } from "../store/session.store";

const baseURL = "http://localhost:57678/api";

const apiInstance = axios.create({
  baseURL,
});

apiInstance.interceptors.request.use((config) => {
  const idToken = useAuthStore.getState().claims?.token;
  if (idToken) {
    config.headers.Authorization = `Bearer ${idToken}`;
  }
  return config;
});

apiInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    const UNAUTHORIZED = 401;
    const FORBIDDEN = 403;
    if (response.status === UNAUTHORIZED) {
      console.log("✋🏻✋🏻✋🏻 Not Authenticated: ", response.data);
      useAuthStore.getState().logout();
    }

    if (response.status === FORBIDDEN){
      console.log("🚫🚫🚫 Forbidden: ", response.data);
      useAuthStore.getState().logout();
    }
    return response;
  },
  (error: any) => {
    console.error("Response Error:", error);
    return Promise.reject(new Error(error));
  }
);

export default apiInstance;
