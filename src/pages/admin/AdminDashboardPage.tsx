import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { bookingService } from "@/services/bookingService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Users, CheckCircle, XCircle, Clock, TrendingUp } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

export const AdminDashboardPage = () => {
  // const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const { data: bookings, isLoading } = useQuery({
    queryKey: ["admin-bookings", selectedDate],
    queryFn: () =>
      selectedDate
        ? bookingService.getAllReservationsByDate(format(selectedDate, "yyyy-MM-dd"))
        : bookingService.getAllReservations(),
  });
  console.log("Admin bookings fetched:", bookings, isLoading);
  // Tính thống kê
  const stats = {
    total: bookings?.length || 0,
    booked: bookings?.filter((b) => b.status === "BOOKED").length || 0,
    completed: bookings?.filter((b) => b.status === "COMPLETED").length || 0,
    cancelled: bookings?.filter((b) => b.status === "CANCELLED").length || 0,
  };

  const statCards = [
    {
      title: "Tổng Đặt",
      value: stats.total,
      icon: Calendar,
      color: "bg-blue-500",
    },
    {
      title: "Đã Xác Nhận",
      value: stats.booked,
      icon: CheckCircle,
      color: "bg-green-500",
    },
    {
      title: "Hoàn Thành",
      value: stats.completed,
      icon: TrendingUp,
      color: "bg-purple-500",
    },
    {
      title: "Đã Hủy",
      value: stats.cancelled,
      icon: XCircle,
      color: "bg-red-500",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-gray-500">{format(selectedDate, "EEEE, dd/MM/yyyy", { locale: vi })}</p>
        </div>
        <input
          type="date"
          value={selectedDate ? format(selectedDate, "yyyy-MM-dd") : ""}
          onChange={(e) => setSelectedDate(e.target.value ? new Date(e.target.value) : null)}
          className="border rounded-lg px-4 py-2"
        />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{stat.title}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-full`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Bookings */}
      <Card>
        <CardHeader>
          <CardTitle>📋 Đặt Chỗ Hôm Nay</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto" />
            </div>
          ) : bookings && bookings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Giờ</th>
                    <th className="text-left py-3 px-4">Khách</th>
                    <th className="text-left py-3 px-4">Số Người</th>
                    <th className="text-left py-3 px-4">SĐT</th>
                    <th className="text-left py-3 px-4">Trạng Thái</th>
                    <th className="text-left py-3 px-4">Hành Động</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking.bookingId} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{booking.timeSlot || "N/A"}</td>
                      <td className="py-3 px-4">{booking.customerName || "N/A"}</td>
                      <td className="py-3 px-4">{booking.numberOfGuests || "N/A"}</td>
                      <td className="py-3 px-4">{booking.customerPhone || "N/A"}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            booking.status === "BOOKED"
                              ? "bg-green-100 text-green-800"
                              : booking.status === "CANCELLED"
                                ? "bg-red-100 text-red-800"
                                : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {booking.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          {booking.status === "BOOKED" && (
                            <>
                              <Button size="sm" variant="outline" className="text-green-600">
                                ✓
                              </Button>
                              <Button size="sm" variant="outline" className="text-red-600">
                                ✕
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">Không có đặt chỗ nào hôm nay</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
