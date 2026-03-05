// src/services/authService.ts

import { apiClient } from "@/lib/axios";
import type { LoginRequest, LoginResponse, AdminUser } from "@/types/admin";

export const authService = {
  login: async (payload: LoginRequest): Promise<LoginResponse> => {
    console.log("payload----------", payload);

    const { data } = await apiClient.post("/auth/login", payload);
    // Lưu token vào localStorage
    console.log("token----------", data.token);

    if (data.token) {
      localStorage.setItem("admin_token", data.token);
    }
    return data;
  },

  logout: () => {
    localStorage.removeItem("admin_token");
  },

  getToken: (): string | null => {
    return localStorage.getItem("admin_token");
  },

  getCurrentUser: (): AdminUser | null => {
    const user = localStorage.getItem("admin_user");
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem("admin_token");
  },
};
