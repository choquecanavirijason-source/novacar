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

/**
 * Convierte la respuesta de error del backend (Laravel: `{message}` en
 * 401/500, `{message, errors}` en 422) en un texto legible para el usuario,
 * en vez del genérico "Request failed: POST /...". Cae a un mensaje por
 * status cuando el body no trae nada útil (ej. HTML de un 500 sin JSON).
 */
function extractErrorMessage(data: unknown, status: number, fallback: string): string {
  if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>;
    if (obj.errors && typeof obj.errors === "object") {
      const firstField = Object.values(obj.errors as Record<string, unknown>)[0];
      const firstMessage = Array.isArray(firstField) ? firstField[0] : firstField;
      if (typeof firstMessage === "string") return firstMessage;
    }
    if (typeof obj.message === "string" && obj.message.trim()) return obj.message;
  }
  if (typeof data === "string" && data.trim() && data.length < 300) return data;
  if (status === 401) return "Sesión expirada o no autorizada. Vuelve a iniciar sesión.";
  if (status === 403) return "No tienes permiso para realizar esta acción.";
  if (status === 404) return "El recurso solicitado no existe.";
  if (status >= 500) return "Error del servidor. Intenta de nuevo en unos minutos.";
  return fallback;
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
    let res: Response;
    try {
      res = await fetch(buildUrl(this.baseUrl, path, config?.params), {
        method,
        headers: { ...this.defaultHeaders, ...config?.headers },
        body: body !== undefined ? JSON.stringify(body) : undefined,
        signal: config?.signal,
      });
    } catch {
      // Backend caído/inaccesible, CORS, sin red, etc. — el fetch nunca
      // llega a responder, así que no hay `res` ni status que reportar.
      throw new HttpError(0, "No se pudo conectar con el servidor. Verifica tu conexión e inténtalo de nuevo.");
    }

    const isJson = res.headers.get("content-type")?.includes("application/json");
    const data = isJson ? await res.json() : ((await res.text()) as unknown);

    if (!res.ok) {
      throw new HttpError(res.status, extractErrorMessage(data, res.status, `Request failed: ${method} ${path}`), data);
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
