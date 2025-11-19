import { Interceptor } from "./interceptor.interface";

export interface ApiResponse<T> {
  status: number;
  data: T | null;
}

export interface HttpClient {
  addInterceptor(interceptor: Interceptor): void;
  get<T = unknown>(
    path: string,
    params?: Record<string, any>
  ): Promise<ApiResponse<T>>;
  post<T = unknown>(path: string, body?: any): Promise<ApiResponse<T>>;
  put<T = unknown>(path: string, body?: any): Promise<ApiResponse<T>>;
  delete<T = unknown>(path: string): Promise<ApiResponse<T>>;
}
