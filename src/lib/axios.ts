// src/lib/axios.ts
import axios from "axios";

export const apiClient = axios.create({
  baseURL: "http://localhost:8080/api", // Dùng proxy đã cấu hình trong vite.config.ts
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("admin_token");
    if (token && config.url?.includes("/admin/")) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Interceptor để xử lý lỗi global (ví dụ: 401, 500)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("admin_token");
      // localStorage.removeItem("admin_user");
      window.location.href = "/admin/login";
    }
    return Promise.reject(error);
  },
);
