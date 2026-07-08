/**
 * Core · HttpClient
 * Cliente HTTP base reutilizable (cross-cutting).
 * La capa /data depende de esta abstracción, nunca de `fetch` directamente,
 * para poder intercambiar la implementación (REST, GraphQL, mock) sin tocar repositorios.
 */

export interface HttpRequestConfig {
  headers?: Record<string, string>;
  signal?: AbortSignal;
  params?: Record<string, string | number | boolean | undefined>;
}

export interface HttpClient {
  get<T>(path: string, config?: HttpRequestConfig): Promise<T>;
  post<T, B = unknown>(path: string, body: B, config?: HttpRequestConfig): Promise<T>;
  put<T, B = unknown>(path: string, body: B, config?: HttpRequestConfig): Promise<T>;
  patch<T, B = unknown>(path: string, body: B, config?: HttpRequestConfig): Promise<T>;
  delete<T>(path: string, config?: HttpRequestConfig): Promise<T>;
}

export class HttpError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly payload?: unknown,
  ) {
    super(message);
    this.name = "HttpError";
  }
}

function buildUrl(baseUrl: string, path: string, params?: HttpRequestConfig["params"]): string {
  const url = new URL(path.replace(/^\//, ""), baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) url.searchParams.set(key, String(value));
    }
  }
  return url.toString();
}

/** Implementación REST sobre fetch. */
export class FetchHttpClient implements HttpClient {
  constructor(
    private readonly baseUrl: string,
    private readonly defaultHeaders: Record<string, string> = {
      "Content-Type": "application/json",
    },
  ) {}

  private async request<T>(
    method: string,
    path: string,
    config?: HttpRequestConfig,
    body?: unknown,
  ): Promise<T> {
    const res = await fetch(buildUrl(this.baseUrl, path, config?.params), {
      method,
      headers: { ...this.defaultHeaders, ...config?.headers },
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: config?.signal,
    });

    const isJson = res.headers.get("content-type")?.includes("application/json");
    const data = isJson ? await res.json() : ((await res.text()) as unknown);

    if (!res.ok) {
      throw new HttpError(res.status, `Request failed: ${method} ${path}`, data);
    }
    return data as T;
  }

  get<T>(path: string, config?: HttpRequestConfig) {
    return this.request<T>("GET", path, config);
  }
  post<T, B = unknown>(path: string, body: B, config?: HttpRequestConfig) {
    return this.request<T>("POST", path, config, body);
  }
  put<T, B = unknown>(path: string, body: B, config?: HttpRequestConfig) {
    return this.request<T>("PUT", path, config, body);
  }
  patch<T, B = unknown>(path: string, body: B, config?: HttpRequestConfig) {
    return this.request<T>("PATCH", path, config, body);
  }
  delete<T>(path: string, config?: HttpRequestConfig) {
    return this.request<T>("DELETE", path, config);
  }
}
