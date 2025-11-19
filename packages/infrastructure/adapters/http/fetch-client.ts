import {
  Interceptor,
  RequestConfig,
} from "../../../application/ports/http/interceptor.interface";
import {
  HttpClient,
  ApiResponse,
} from "../../../application/ports/http/http-client.interface";

export class FetchClient implements HttpClient {
  private interceptors: Interceptor[] = [];

  constructor(private base = "/api") {}

  addInterceptor(interceptor: Interceptor): void {
    this.interceptors.push(interceptor);
  }

  private _buildUrl(path: string, params?: Record<string, any>): string {
    const url = new URL(this.base + path);

    if (params) {
      Object.entries(params).forEach(([k, v]) =>
        url.searchParams.append(k, String(v))
      );
    }

    return url.toString();
  }

  private async _handleResponse<T>(resp: Response): Promise<ApiResponse<T>> {
    const status = resp.status;
    let data: T | null = null;
    const text = await resp.text();

    try {
      data = text ? (JSON.parse(text) as T) : null;
    } catch (err) {
      data = null;
    }

    if (status >= 400) {
      const error: any = new Error(`HTTP Error ${status}`);
      error.status = status;
      error.data = data;
      error.response = resp;
      throw error;
    }

    let response: ApiResponse<T> = { status, data };
    for (const interceptor of this.interceptors) {
      if (interceptor.onResponse) {
        response = await interceptor.onResponse(response);
      }
    }

    return response;
  }

  private async _fetchApi(
    url: string,
    method: string,
    options: RequestInit = {}
  ): Promise<Response> {
    let config: RequestConfig = { url, method, options };

    for (const interceptor of this.interceptors) {
      if (interceptor.onRequest) {
        config = await interceptor.onRequest(config);
      }
    }

    return await fetch(config.url, {
      method: config.method ?? "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      ...config.options,
    });
  }

  private async _request<T>(
    path: string,
    method: string,
    options: RequestInit = {},
    params?: Record<string, any>
  ): Promise<ApiResponse<T>> {
    const url = this._buildUrl(path, params);

    try {
      const response = await this._fetchApi(url, method, options);
      return await this._handleResponse<T>(response);
    } catch (error) {
      for (const interceptor of this.interceptors) {
        if (interceptor.onError) {
          try {
            return await interceptor.onError(error, () =>
              this._request<T>(path, method, options, params)
            );
          } catch (interceptorError) {
            continue;
          }
        }
      }
      throw error;
    }
  }

  async get<T = unknown>(
    path: string,
    params?: Record<string, any>
  ): Promise<ApiResponse<T>> {
    return this._request<T>(path, "GET", {}, params);
  }

  async post<T = unknown>(path: string, body?: any): Promise<ApiResponse<T>> {
    return this._request<T>(path, "POST", { body: JSON.stringify(body) });
  }

  async put<T = unknown>(path: string, body?: any): Promise<ApiResponse<T>> {
    return this._request<T>(path, "PUT", { body: JSON.stringify(body) });
  }

  async delete<T = unknown>(path: string): Promise<ApiResponse<T>> {
    return this._request<T>(path, "DELETE");
  }
}
