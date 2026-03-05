import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "sonner";

// Layout
import { CustomerLayout } from "./components/layout/CustomerLayout";
import { AdminLayout } from "./components/layout/AdminLayout";

// Customer Pages
import { BookingPage } from "./pages/customer/BookingPage";
import { ConfirmationPage } from "./pages/customer/ConfirmationPage";
import { CheckBookingPage } from "./pages/customer/CheckingBookingPage";

// Admin Pages
import { AdminLoginPage } from "./pages/admin/AdminLoginPage";
import { AdminDashboardPage } from "./pages/admin/AdminDashboardPage";

// Guards
import { AdminGuard } from "./components/admin/AdminGuard";
import { AdminRoute } from "./components/admin/AdminRoute";

// 今後実装予定のページ
// import { AdminBookingsPage } from "./pages/admin/AdminBookingsPage";
// import { AdminSettingsPage } from "./pages/admin/AdminSettingsPage";

// 仮のページ（開発用プレースホルダー）
const CustomerHome = () => <div className="p-8">予約ページ（Customer）</div>;
const CheckBooking = () => <div className="p-8">予約確認ページ</div>;

const AdminLogin = () => <div className="p-8">管理者ログイン</div>;
const AdminDashboard = () => <div className="p-8">管理ダッシュボード</div>;
const AdminBookings = () => <div className="p-8">予約管理</div>;
const AdminSettings = () => <div className="p-8">設定</div>;

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* ================= Customer Routes ================= */}

          <Route
            path="/"
            element={
              <CustomerLayout>
                <div className="p-8">ホームページ</div>
              </CustomerLayout>
            }
          />

          <Route
            path="/booking"
            element={
              <CustomerLayout>
                <BookingPage />
              </CustomerLayout>
            }
          />

          <Route
            path="/check-booking"
            element={
              <CustomerLayout>
                <CheckBookingPage />
              </CustomerLayout>
            }
          />

          <Route
            path="/confirmation/:bookingId"
            element={
              <CustomerLayout>
                <ConfirmationPage />
              </CustomerLayout>
            }
          />

          {/* ================= Admin Routes ================= */}

          <Route path="/admin/login" element={<AdminLoginPage />} />

          <Route
            path="/admin"
            element={
              <AdminLayout>
                <AdminDashboardPage />
              </AdminLayout>
            }
          />

          <Route
            path="/admin/bookings"
            element={
              <AdminLayout>
                <AdminBookings />
              </AdminLayout>
            }
          />

          <Route
            path="/admin/settings"
            element={
              <AdminLayout>
                <AdminSettings />
              </AdminLayout>
            }
          />

          {/* ================= Fallback ================= */}

          {/* 不明なURLはホームへリダイレクト */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* Toast通知 */}
        <Toaster richColors position="top-right" />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
