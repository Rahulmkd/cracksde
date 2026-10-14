const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

export interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
}

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = (baseUrl || "").replace(/\/+$/, "");
  }

  private getEffectiveBaseUrl(): string {
    if (typeof window !== "undefined") {
      // If baseUrl is unset or points to localhost/127.0.0.1, use window.location.origin (Next.js reverse proxy)
      // This prevents mobile browsers from failing to reach localhost:5001 on the phone's loopback
      if (!this.baseUrl || this.baseUrl.includes("localhost") || this.baseUrl.includes("127.0.0.1")) {
        return window.location.origin;
      }
      return this.baseUrl;
    }
    return this.baseUrl || process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
  }

  private getFullUrl(endpoint: string): string {
    const cleanPath = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
    return `${this.getEffectiveBaseUrl()}${cleanPath}`;
  }

  private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { body, headers: customHeaders, ...rest } = options;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(customHeaders as Record<string, string>),
    };

    if (typeof window !== "undefined") {
      try {
        const token = localStorage.getItem("cracksde_auth_token");
        if (token && !headers["Authorization"] && !headers["authorization"]) {
          headers["Authorization"] = `Bearer ${token}`;
        }
      } catch {}
    }

    const config: RequestInit = {
      ...rest,
      headers,
      credentials: "include",
    };

    if (body) {
      config.body = JSON.stringify(body);
    }

    const response = await fetch(this.getFullUrl(endpoint), config);

    if (response.status === 401 && typeof window !== "undefined") {
      try {
        localStorage.removeItem("cracksde_auth_token");
      } catch {}
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: "Request failed" }));
      throw new Error(error.error || error.message || `HTTP ${response.status}`);
    }

    return response.json() as Promise<T>;
  }

  get<T>(endpoint: string, options?: RequestOptions) {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  post<T>(endpoint: string, body?: unknown, options?: RequestOptions) {
    return this.request<T>(endpoint, { ...options, method: "POST", body });
  }

  put<T>(endpoint: string, body?: unknown, options?: RequestOptions) {
    return this.request<T>(endpoint, { ...options, method: "PUT", body });
  }

  patch<T>(endpoint: string, body?: unknown, options?: RequestOptions) {
    return this.request<T>(endpoint, { ...options, method: "PATCH", body });
  }

  delete<T>(endpoint: string, options?: RequestOptions) {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
  }
}

export const api = new ApiClient(API_URL);
