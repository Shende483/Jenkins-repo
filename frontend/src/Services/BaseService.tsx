
import type { AxiosError, AxiosHeaders, AxiosInstance, AxiosResponse } from "axios";

import axios from "axios";

const API_BASE_URL = `http://${import.meta.env.VITE_BACKEND_IP}:${import.meta.env.VITE_BACKEND_PORT}`;

export interface ApiResponse<T> {
  access_token: any;
  message: string;
  data: T;
  status: string;
  statusCode: number;
}

export default class BaseService {
  private static accessToken = localStorage.getItem('accessToken');

  private static userId: string = localStorage.getItem('appUser') as string;

  static header = {
    Authorization: `Bearer ${this.accessToken}`,
    'Accept-Language': "en"
  }

  private static api: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: this.header
  });

  static getApi() {
    return this.api;
  }

  static getUserId() {
    return this.userId;
  }

  protected static async handleRequest<T>(request: Promise<AxiosResponse<ApiResponse<T>>>) {
    try {
      const response = await request;
      // Accept any 2xx status code as success
      if (response.status >= 200 && response.status < 400) {
        return response.data;
      }
      throw new Error(response.data.message || 'Request failed');
    } catch (error: any) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        throw new Error(axiosError.response?.data?.message || 'Request failed');
      } else {
        throw new Error('Network error');
      }
    }
  }

  // Add this to BaseService class
  public static postLogin(url: string, body: object) {
    return this.api.post(url, body)
      .then(response => {
        if (response.status >= 200 && response.status < 300) {
          return response.data; // Return the raw data without further processing
        }
        throw new Error(response.data.message || 'Request failed');
      })
      .catch(error => {
        const axiosError = error;
        if (axiosError.response) {
          throw new Error(axiosError.response?.data?.message || 'Request failed');
        } else {
          throw new Error('Network error');
        }
      });
  }

  public static post<T>(url: string, body: object) {
    return this.handleRequest<T>(this.api.post(url, body));
  }

  protected static postParam<T>(url: string, reqParam: unknown) {
    return this.handleRequest<T>(this.api.post(url, null, { params: reqParam }));
  }

  protected static get<T>(url: string) {
    return this.handleRequest<T>(this.api.get(url));
  }

  protected static getHeaders<T>(url: string, headers: AxiosHeaders) {
    return this.handleRequest<T>(this.api.get(url, { headers }));
  }

  protected static getParam<T>(url: string, reqParam: unknown) {
    return this.handleRequest<T>(this.api.get(url, { params: reqParam }));
  }

  protected static put<T>(url: string, body: object) {
    return this.handleRequest<T>(this.api.put(url, body));
  }

  protected static delete<T>(url: string) {
    return this.handleRequest<T>(this.api.delete(url));
  }
}