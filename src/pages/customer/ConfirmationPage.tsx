import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { bookingService } from "@/services/bookingService";
import type { BookingDetailResponse } from "@/types/booking";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Calendar, Clock, Users, User, Printer, Mail, Phone, AlertCircle, Home } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

export const ConfirmationPage = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<BookingDetailResponse | null>(null);

  // Fetch booking details
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["booking", bookingId],
    queryFn: () => {
      if (!bookingId) throw new Error("Không có booking ID");
      return bookingService.getBookingById(bookingId);
    },
    enabled: !!bookingId,
    retry: false,
  });
  console.log("Booking details fetched:", data, error);

  useEffect(() => {
    if (data) {
      setBooking(data);
    }
    if (error) {
      toast.error("❌ Không tìm thấy thông tin đặt chỗ");
    }
  }, [data, error]);

  const handlePrint = () => {
    window.print();
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  const handleGoHome = () => {
    navigate("/");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "BOOKED":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200 px-3 py-1">
            <CheckCircle className="w-3 h-3 mr-1" />
            Đã Xác Nhận
          </Badge>
        );
      case "CANCELLED":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200 px-3 py-1">
            <AlertCircle className="w-3 h-3 mr-1" />
            Đã Hủy
          </Badge>
        );
      case "COMPLETED":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200 px-3 py-1">
            <CheckCircle className="w-3 h-3 mr-1" />
            Hoàn Thành
          </Badge>
        );
      default:
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200 px-3 py-1">{status}</Badge>;
    }
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-lg mx-auto text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-red-600 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">Đang tải thông tin đặt chỗ...</p>
        </div>
      </div>
    );
  }

  // Error State (Booking not found)
  if (error || !booking) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-lg mx-auto">
          <Card className="border-2 border-red-200">
            <CardContent className="p-8 text-center space-y-6">
              <AlertCircle className="w-20 h-20 text-red-600 mx-auto" />

              <div>
                <h1 className="text-2xl font-bold text-red-600">KHÔNG TÌM THẤY ĐẶT CHỖ</h1>
                <p className="text-gray-500 mt-2">Mã đặt chỗ không tồn tại hoặc đã bị xóa</p>
              </div>

              <div className="bg-gray-100 p-4 rounded-lg text-left space-y-2">
                <p className="text-sm text-gray-600">📋 Nguyên nhân có thể:</p>
                <ul className="text-sm text-gray-500 space-y-1 ml-4">
                  <li>• Mã đặt chỗ không chính xác</li>
                  <li>• Đặt chỗ đã bị hủy</li>
                  <li>• Link đã hết hạn</li>
                </ul>
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" className="flex-1" onClick={() => navigate("/check-booking")}>
                  <Phone className="w-4 h-4 mr-2" />
                  Kiểm Tra Đơn
                </Button>
                <Button className="flex-1 bg-red-600 hover:bg-red-700" onClick={handleBackToHome}>
                  <Home className="w-4 h-4 mr-2" />
                  Đặt Bàn Mới
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Success State
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-16 h-16 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-green-600">ĐẶT BÀN THÀNH CÔNG!</h1>
          <p className="text-gray-500 mt-2">Cảm ơn bạn đã đặt bàn tại Sapporo Ramen</p>
        </div>

        {/* Booking Card */}
        <Card className="border-2 border-green-200 shadow-lg">
          <CardContent className="p-8 space-y-6">
            {/* Booking ID */}
            <div className="text-center bg-gray-100 p-6 rounded-lg">
              <p className="text-sm text-gray-500 mb-2">Mã Đặt Bàn</p>
              <p className="text-3xl font-bold text-red-600 tracking-wider">
                #{booking.bookingId.slice(-8).toUpperCase()}
              </p>
              <p className="text-xs text-gray-400 mt-1">(Mã đầy đủ: {booking.bookingId})</p>
            </div>

            {/* Status Badge */}
            <div className="flex justify-center">{getStatusBadge(booking.status)}</div>

            {/* Booking Details */}
            <div className="space-y-4 pt-4 border-t">
              <h3 className="font-semibold text-lg text-gray-700">📋 Thông Tin Đặt Bàn</h3>

              <div className="grid gap-4">
                <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Ngày Đặt</p>
                    <p className="font-medium text-gray-900">
                      {format(new Date(booking.bookingDate), "EEEE, dd/MM/yyyy", { locale: vi })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Clock className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Giờ Đặt</p>
                    <p className="font-medium text-gray-900">{booking.timeSlot}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Users className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Số Người</p>
                    <p className="font-medium text-gray-900">{booking.numberOfGuests} người</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Details */}
            <div className="space-y-4 pt-4 border-t">
              <h3 className="font-semibold text-lg text-gray-700">👤 Thông Tin Khách Hàng</h3>

              <div className="grid gap-4">
                <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <User className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Họ Tên</p>
                    <p className="font-medium text-gray-900">{booking.customerName}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Phone className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Số Điện Thoại</p>
                    <p className="font-medium text-gray-900">{booking.customerPhone}</p>
                  </div>
                </div>

                {booking.customerEmail && (
                  <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Mail className="w-5 h-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium text-gray-900">{booking.customerEmail}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Booking Time */}
            <div className="pt-4 border-t text-sm text-gray-500">
              <p>🕐 Đặt lúc: {format(new Date(booking.createdAt), "dd/MM/yyyy HH:mm", { locale: vi })}</p>
            </div>

            {/* Important Notes */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 space-y-2">
              <h4 className="font-semibold text-yellow-800 flex items-center">
                <AlertCircle className="w-4 h-4 mr-2" />
                Lưu Ý Quan Trọng
              </h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>
                  • Vui lòng đến trước <strong>15 phút</strong> so với giờ đặt để giữ chỗ
                </li>
                <li>
                  • Bàn sẽ được giữ tối đa <strong>15 phút</strong> sau giờ đặt
                </li>
                <li>
                  • Cần hủy trước <strong>2 giờ</strong> nếu không đến được
                </li>
                <li>• Nhóm trên 8 người vui lòng gọi trực tiếp: 0909 xxx xxx</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button variant="outline" className="flex-1" onClick={handlePrint}>
                <Printer className="w-4 h-4 mr-2" />
                In Xác Nhận
              </Button>
              <Button className="flex-1 bg-red-600 hover:bg-red-700" onClick={handleGoHome}>
                <Home className="w-4 h-4 mr-2" />
                Về Trang Chủ
              </Button>
            </div>

            {/* Contact Support */}
            <div className="text-center pt-4 border-t text-sm text-gray-500">
              <p>
                📞 Cần hỗ trợ? Gọi: <strong>0909 xxx xxx</strong>
              </p>
              <p>
                📧 Email: <strong>contact@sappororamen.com</strong>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Check Booking Link */}
        <div className="text-center mt-6">
          <Link to="/check-booking" className="text-sm text-red-600 hover:text-red-700 underline">
            🔍 Kiểm tra thông tin đặt chỗ anytime
          </Link>
        </div>
      </div>
    </div>
  );
};
