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

    // トークンが存在しない場合は何もしない
    if (!token) return;

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      const now = Date.now() / 1000;
      const timeLeft = decoded.exp - now;

      // 有効期限が5分未満の場合はログアウトする
      if (timeLeft < 300) {
        console.warn("⚠️ トークンの有効期限が近づいています。ログアウトします。");
        authService.logout();
        navigate("/admin/login");
      }
    } catch (error) {
      // トークンが不正な場合はログアウトしてログイン画面へ遷移
      console.error("トークンが不正です:", error);
      authService.logout();
      navigate("/admin/login");
    }
  }, [navigate]);

  // 1分ごとにトークンの有効期限をチェックする
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
