const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  error?: string;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    pages: number;
  };
}

export async function apiCall<T = any>(
  endpoint: string,
  options: RequestInit & { params?: Record<string, any> } = {}
): Promise<T> {
  const { params, ...fetchOptions } = options;

  // Build query string
  let url = `${API_URL}${endpoint}`;
  if (params) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        query.append(key, String(value));
      }
    });
    const queryString = query.toString();
    if (queryString) url += `?${queryString}`;
  }

  // Get token from localStorage
  const token = typeof window !== "undefined" ? localStorage.getItem("auth-storage") : null;
  let authToken = null;
  if (token) {
    try {
      const parsed = JSON.parse(token);
      authToken = parsed.state?.token;
    } catch {
      // Token not found or invalid
    }
  }

  // Prepare headers
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(fetchOptions.headers as Record<string, string> | undefined)
  };

  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  // Make request
  const response = await fetch(url, {
    ...fetchOptions,
    headers
  });

  // Handle errors
  if (!response.ok) {
    if (response.status === 401) {
      // Clear auth on 401
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth-storage");
        window.location.href = "/login";
      }
    }
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.message || error.error || `API Error: ${response.status}`);
  }

  // Parse and return
  return response.json();
}

export async function get<T = any>(endpoint: string, params?: Record<string, any>): Promise<T> {
  return apiCall<T>(endpoint, { method: "GET", params });
}

export async function post<T = any>(endpoint: string, body?: any, params?: Record<string, any>): Promise<T> {
  return apiCall<T>(endpoint, {
    method: "POST",
    body: body ? JSON.stringify(body) : undefined,
    params
  });
}

export async function patch<T = any>(endpoint: string, body?: any, params?: Record<string, any>): Promise<T> {
  return apiCall<T>(endpoint, {
    method: "PATCH",
    body: body ? JSON.stringify(body) : undefined,
    params
  });
}

export async function del<T = any>(endpoint: string, params?: Record<string, any>): Promise<T> {
  return apiCall<T>(endpoint, { method: "DELETE", params });
}
