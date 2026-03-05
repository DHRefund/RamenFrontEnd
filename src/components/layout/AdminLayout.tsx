import { ReactNode, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";
import { authService } from "@/services/authService";
import { toast } from "sonner";

interface AdminLayoutProps {
  children: ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogout = () => {
    authService.logout();
    toast.success("👋 ログアウトしました");
    navigate("/admin/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar onLogout={handleLogout} isOpen={isSidebarOpen} />
      <div className="flex-1 flex flex-col">
        <AdminHeader onLogout={handleLogout} currentUser={authService.getCurrentUser()} />
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
};
