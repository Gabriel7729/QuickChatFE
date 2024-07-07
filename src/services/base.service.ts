import axios, { AxiosInstance, AxiosResponse } from "axios";
import apiInstance from "../common/axios/httpClient.axios";
import {
  ResponseModel,
  ResponseListModel,
  ResponsePaginatedModel,
  DeleteResponse,
} from "../models/base.model";
import { useAuthStore } from "../common/store/session.store";

class BaseService<T> {
  public api: AxiosInstance;

  constructor(baseURL: string) {
    this.api = axios.create({
      baseURL: apiInstance.defaults.baseURL + baseURL,
    });

    this.api.interceptors.request.use((config) => {
      const idToken = useAuthStore.getState().claims?.token;
      if (idToken) {
        config.headers.Authorization = `Bearer ${idToken}`;
      }
      return config;
    });

    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        return this.handleSuccess(response);
      },
      (error: any) => {
        return this.handleError(error);
      }
    );
  }

  private handleSuccess(response: AxiosResponse): AxiosResponse {
    return response;
  }

  private handleError(error: any): Promise<never> {
    const UNAUTHORIZED = 401;
    const FORBIDDEN = 403;

    if (error.response) {
      const { status, data } = error.response;

      if (status === UNAUTHORIZED) {
        console.log("✋🏻✋🏻✋🏻 Not Authenticated: ", data);
        useAuthStore.getState().logout();
      }

      if (status === FORBIDDEN) {
        console.log("🚫🚫🚫 Forbidden: ", data);
        useAuthStore.getState().logout();
      }
    }

    const errorMessage = error.message || "An error occurred";
    const errorObject = new Error(errorMessage);
    return Promise.reject(errorObject);
  }

  public async getPaginated(url: string): Promise<ResponsePaginatedModel<T>> {
    const res = await this.api.get<ResponsePaginatedModel<T>>(url);
    return res.data;
  }

  public async getList(url: string): Promise<ResponseListModel<T>> {
    const res = await this.api.get<ResponseListModel<T>>(url);
    return res.data;
  }

  public async getById(url: string): Promise<ResponseModel<T>> {
    const res = await this.api.get<ResponseModel<T>>(url);
    return res.data;
  }

  public async post(url: string, data: any): Promise<ResponseModel<T>> {
    const res = await this.api.post<ResponseModel<T>>(url, data);
    return res.data;
  }

  public async put(url: string, data: any): Promise<ResponseModel<T>> {
    const res = await this.api.put<ResponseModel<T>>(url, data);
    return res.data;
  }

  public async delete(url: string): Promise<ResponseModel<DeleteResponse>> {
    const res = await this.api.delete<ResponseModel<DeleteResponse>>(url);
    return res.data;
  }
}

export default BaseService;
