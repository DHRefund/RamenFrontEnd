import { ReactNode } from "react";
import { AdminGuard } from "./AdminGuard";
import { AdminLayout } from "@/components/layout/AdminLayout";

interface AdminRouteProps {
  children: ReactNode;
}

export const AdminRoute = ({ children }: AdminRouteProps) => {
  return (
    <AdminGuard>
      <AdminLayout>{children}</AdminLayout>
    </AdminGuard>
  );
};
