import axios from "axios";
import {
  AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { refreshToken } from "@/services/api.service";
import { getAccessToken, clearAuthTokens } from "@/utils/auth";
import type { RetryConfig } from "@/types/common";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
  timeout: 10000,
});

let isRefreshing = false;

type FailedRequest = {
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
  config: InternalAxiosRequestConfig;
};

let failedQueue: FailedRequest[] = [];

const processQueue = (
  error: AxiosError | null,
  token: string | null = null
) => {
  failedQueue.forEach(({ resolve, reject, config }) => {
    if (error) {
      reject(error);
    } else if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
      apiClient(config).then(resolve).catch(reject);
    } else {
      reject(new Error("Token refresh failed without specific error."));
    }
  });
  failedQueue = [];
};
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    try {
      if (!config.url) {
        throw new Error("Request URL is missing.");
      }

      const token = getAccessToken();
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  (error: AxiosError) => Promise.reject(error)
);
const handleUnauthorized = () => {
  clearAuthTokens();
  window.location.href = `/login?redirect=${encodeURIComponent(
    location.pathname
  )}`;
};

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    // Handle 401 for non-refresh token requests
    if (
      error.response?.status === 401 &&
      !error.config?.url?.includes("token/refresh")
    ) {
      handleUnauthorized();
      return Promise.reject(error);
    }

    const originalRequest = error.config as RetryConfig;

    // If not 401 or already retried, reject
    if (error.response?.status !== 401 || originalRequest?._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject, config: originalRequest });
      });
    }

    isRefreshing = true;

    try {
      const newToken = await refreshToken();

      if (!newToken) {
        throw new Error("Failed to obtain new token during refresh.");
      }

      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
      }

      processQueue(null, newToken);
      return apiClient(originalRequest);
    } catch (err: unknown) {
      const axiosError = err as AxiosError;
      if (axiosError?.response?.status === 401) {
        processQueue(axiosError, null);
        handleUnauthorized();
      }
      return Promise.reject(axiosError);
    } finally {
      isRefreshing = false;
    }
  }
);

export const uploadFile = async <T = unknown>(
  url: string,
  file: File,
  fieldName = "file",
  data: Record<string, string | Blob> = {}
): Promise<AxiosResponse<T>> => {
  const formData = new FormData();
  formData.append(fieldName, file);
  Object.entries(data).forEach(([key, value]) => formData.append(key, value));

  return apiClient.post(url, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export default apiClient;
