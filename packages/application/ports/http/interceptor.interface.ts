import { ApiResponse } from "./http-client.interface";

export interface RequestConfig {
  url: string;
  method: string;
  options: RequestInit;
}

export interface Interceptor {
  onRequest?(config: RequestConfig): Promise<RequestConfig> | RequestConfig;
  onResponse?<T>(
    response: ApiResponse<T>
  ): Promise<ApiResponse<T>> | ApiResponse<T>;
  onError?(error: any, retry: () => Promise<any>): Promise<any>;
}
