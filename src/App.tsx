import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "sonner";

// Layouts
import { CustomerLayout } from "./components/layout/CustomerLayout";
import { AdminLayout } from "./components/layout/AdminLayout";
import { BookingPage } from "./pages/customer/BookingPage";
import { ConfirmationPage } from "./pages/customer/ConfirmationPage";
import { CheckBookingPage } from "./pages/customer/CheckingBookingPage";
import { AdminLoginPage } from "./pages/admin/AdminLoginPage";
import { AdminDashboardPage } from "./pages/admin/AdminDashboardPage";

// Guards
import { AdminGuard } from "./components/admin/AdminGuard";
import { AdminRoute } from "./components/admin/AdminRoute";

// import { AdminBookingsPage } from "./pages/admin/AdminBookingsPage";
// import { AdminSettingsPage } from "./pages/admin/AdminSettingsPage";

// Pages (Placeholder - sẽ xây dựng ở phần sau)
const CustomerHome = () => <div className="p-8">Trang Đặt Bàn - Customer</div>;
const CheckBooking = () => <div className="p-8">Kiểm Tra Đơn Hàng</div>;
// const Confirmation = () => <div className="p-8">Xác Nhận Đặt Bàn</div>;

const AdminLogin = () => <div className="p-8">Admin Login</div>;
const AdminDashboard = () => <div className="p-8">Admin Dashboard</div>;
const AdminBookings = () => <div className="p-8">Quản Lý Đặt Bàn</div>;
const AdminSettings = () => <div className="p-8">Cài Đặt</div>;

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Customer Routes */}
          <Route
            path="/"
            element={
              <CustomerLayout>
                <div className="p-8">Trang Chủ - Customer</div>
                {/* <BookingPage /> */}
              </CustomerLayout>
            }
          />
          <Route
            path="/booking"
            element={
              <CustomerLayout>
                {/* <div className="p-8">Trang Chủ - Customer</div> */}
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
          {/* Admin Routes */}
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
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route
            path="/admin"
            element={
              <AdminLayout>
                {" "}
                <AdminDashboardPage />{" "}
              </AdminLayout>
            }
          />
          {/* Redirect unknown routes */} <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster richColors position="top-right" />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
