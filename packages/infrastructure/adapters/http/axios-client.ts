import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import {
  Interceptor,
  RequestConfig,
} from "../../../application/ports/http/interceptor.interface";
import {
  HttpClient,
  ApiResponse,
} from "../../../application/ports/http/http-client.interface";

export class AxiosClient implements HttpClient {
  private interceptors: Interceptor[] = [];
  private axiosInstance: AxiosInstance;

  constructor(private base = "/api") {
    this.axiosInstance = axios.create({
      baseURL: this.base,
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
  }

  addInterceptor(interceptor: Interceptor): void {
    this.interceptors.push(interceptor);
  }

  private _toRequestConfig(axiosConfig: AxiosRequestConfig): RequestConfig {
    return {
      url: axiosConfig.url || "",
      method: (axiosConfig.method || "GET").toUpperCase(),
      options: {
        headers: axiosConfig.headers as Record<string, string>,
        body: axiosConfig.data,
      },
    };
  }

  private _toAxiosConfig(config: RequestConfig): AxiosRequestConfig {
    return {
      url: config.url,
      method: config.method.toLowerCase() as any,
      headers: config.options.headers,
      data: config.options.body,
    };
  }

  private _toApiResponse<T>(axiosResponse: AxiosResponse<T>): ApiResponse<T> {
    return {
      status: axiosResponse.status,
      data: axiosResponse.data,
    };
  }

  private async _request<T>(
    path: string,
    method: string,
    data?: any,
    params?: Record<string, any>
  ): Promise<ApiResponse<T>> {
    let axiosConfig: AxiosRequestConfig = {
      url: path,
      method: method.toLowerCase() as any,
      data,
      params,
    };

    try {
      let requestConfig = this._toRequestConfig(axiosConfig);

      for (const interceptor of this.interceptors) {
        if (interceptor.onRequest) {
          requestConfig = await interceptor.onRequest(requestConfig);
        }
      }

      axiosConfig = this._toAxiosConfig(requestConfig);
      const response = await this.axiosInstance.request<T>(axiosConfig);
      let apiResponse = this._toApiResponse<T>(response);

      for (const interceptor of this.interceptors) {
        if (interceptor.onResponse) {
          apiResponse = await interceptor.onResponse(apiResponse);
        }
      }

      return apiResponse;
    } catch (error: any) {
      const standardError = {
        status: error.response?.status || 500,
        data: error.response?.data || null,
        message: error.message,
      };

      for (const interceptor of this.interceptors) {
        if (interceptor.onError) {
          try {
            return await interceptor.onError(standardError, () =>
              this._request<T>(path, method, data, params)
            );
          } catch (interceptorError) {
            continue;
          }
        }
      }

      throw standardError;
    }
  }

  async get<T = unknown>(
    path: string,
    params?: Record<string, any>
  ): Promise<ApiResponse<T>> {
    return this._request<T>(path, "GET", undefined, params);
  }

  async post<T = unknown>(path: string, body?: any): Promise<ApiResponse<T>> {
    return this._request<T>(path, "POST", body);
  }

  async put<T = unknown>(path: string, body?: any): Promise<ApiResponse<T>> {
    return this._request<T>(path, "PUT", body);
  }

  async delete<T = unknown>(path: string): Promise<ApiResponse<T>> {
    return this._request<T>(path, "DELETE");
  }
}
