import { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "@/services/authService";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  sub: string;
  role: string;
  exp: number;
  iat: number;
}

export const useAuth = () => {
  const navigate = useNavigate();

  const checkTokenExpiration = useCallback(() => {
    const token = authService.getToken();
    if (!token) return;

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      const now = Date.now() / 1000;
      const timeLeft = decoded.exp - now;

      // Nếu còn ít hơn 5 phút, logout
      if (timeLeft < 300) {
        console.warn("⚠️ Token sắp hết hạn, đăng xuất...");
        authService.logout();
        navigate("/admin/login");
      }
    } catch (error) {
      console.error("Token không hợp lệ:", error);
      authService.logout();
      navigate("/admin/login");
    }
  }, [navigate]);

  // Check token mỗi 1 phút
  useEffect(() => {
    checkTokenExpiration();
    const interval = setInterval(checkTokenExpiration, 60000);
    return () => clearInterval(interval);
  }, [checkTokenExpiration]);

  const logout = useCallback(() => {
    authService.logout();
    navigate("/admin/login");
  }, [navigate]);

  const isAuthenticated = useCallback(() => {
    return authService.isAuthenticated();
  }, []);

  const getCurrentUser = useCallback(() => {
    return authService.getCurrentUser();
  }, []);

  return {
    logout,
    isAuthenticated,
    getCurrentUser,
  };
};
