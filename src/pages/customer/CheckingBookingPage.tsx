import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { bookingService } from "@/services/bookingService";
import type { BookingSearchResult } from "@/types/booking";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Calendar, Clock, Users, Phone, User, CheckCircle, XCircle, Hourglass } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import type { CancelBookingRequest } from "../../types/booking";
import { CancelBookingDialog } from "../../components/booking/CancelBookingDialog";

const searchFormSchema = z.object({
  phone: z
    .string()
    .min(10, "Số điện thoại phải có ít nhất 10 số")
    .regex(/^0[0-9]{9}$/, "Số điện thoại không hợp lệ (0909xxxxxx)"),
});

type SearchFormValues = z.infer<typeof searchFormSchema>;

export const CheckBookingPage = () => {
  const [searchResults, setSearchResults] = useState<BookingSearchResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<BookingSearchResult | null>(null);

  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SearchFormValues>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      phone: "",
    },
  });
  const cancelMutation = useMutation({
    mutationFn: (payload: CancelBookingRequest) => bookingService.cancelBooking(payload),
    onSuccess: (response) => {
      toast.success("✅ " + response.message);
      setCancelDialogOpen(false);
      setSelectedBooking(null);
      if (searchResults.length > 0) {
        searchMutation.mutate(searchResults[0].customerPhone);
      }
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "❌ Có lỗi xảy ra khi hủy";
      toast.error(message);
    },
  });

  const handleCancelBooking = (booking: BookingSearchResult) => {
    setSelectedBooking(booking);
    setCancelDialogOpen(true);
  };

  const handleConfirmCancel = (reason: string) => {
    if (!selectedBooking) return;
    const payload: CancelBookingRequest = {
      bookingId: selectedBooking.bookingId,
      customerPhone: selectedBooking.customerPhone,
      cancelReason: reason,
    };
    cancelMutation.mutate(payload);
  };

  const searchMutation = useMutation({
    mutationFn: (phone: string) => bookingService.searchByPhone(phone),
    onSuccess: (data) => {
      setSearchResults(data);
      setHasSearched(true);

      if (data.length === 0) {
        toast.info("📋 Không tìm thấy đặt chỗ nào với số điện thoại này");
      } else {
        toast.success(`✅ Tìm thấy ${data.length} đặt chỗ`);
      }
    },
    onError: (error: any) => {
      toast.error("❌ Có lỗi xảy ra khi tìm kiếm");
      setSearchResults([]);
      setHasSearched(true);
    },
  });

  const handleSearch = (formData: SearchFormValues) => {
    setSearchResults([]);
    setHasSearched(false);
    searchMutation.mutate(formData.phone);
  };

  const handleReset = () => {
    reset();
    setSearchResults([]);
    setHasSearched(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "BOOKED":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Đã Xác Nhận
          </Badge>
        );
      case "CANCELLED":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            <XCircle className="w-3 h-3 mr-1" />
            Đã Hủy
          </Badge>
        );
      case "COMPLETED":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Hoàn Thành
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 border-gray-200">
            <Hourglass className="w-3 h-3 mr-1" />
            {status}
          </Badge>
        );
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">🔍 Kiểm Tra Đặt Bàn</h1>
          <p className="text-gray-500">Nhập số điện thoại để tìm kiếm thông tin đặt chỗ của bạn</p>
        </div>

        {/* Search Form */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <form onSubmit={handleSubmit(handleSearch)} className="space-y-4">
              <div>
                <Label htmlFor="phone">Số Điện Thoại *</Label>
                <div className="flex gap-2">
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="0909xxxxxx"
                    {...register("phone")}
                    className={errors.phone ? "border-red-500" : ""}
                  />
                  <Button type="submit" className="bg-red-600 hover:bg-red-700" disabled={searchMutation.isPending}>
                    {searchMutation.isPending ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    ) : (
                      <>
                        <Search className="w-4 h-4 mr-2" />
                        Tìm
                      </>
                    )}
                  </Button>
                </div>
                {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>}
              </div>
            </form>

            {hasSearched && (
              <Button variant="outline" onClick={handleReset} className="w-full">
                Tìm Kiếm Khác
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Loading State */}
        {searchMutation.isPending && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto" />
            <p className="text-gray-500 mt-4">Đang tìm kiếm...</p>
          </div>
        )}

        {/* Results */}
        {hasSearched && !searchMutation.isPending && searchResults.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">📋 Kết Quả Tìm Kiếm ({searchResults.length} đơn)</h2>

            {searchResults.map((booking) => (
              <Card key={booking.bookingId} className="border-l-4 border-l-red-600">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">Mã Đơn: #{booking.bookingId.slice(-8).toUpperCase()}</h3>
                      <p className="text-sm text-gray-500">
                        Đặt ngày: {format(new Date(booking.createdAt), "dd/MM/yyyy HH:mm", { locale: vi })}
                      </p>
                    </div>
                    {getStatusBadge(booking.status)}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Ngày Đặt</p>
                        <p className="font-medium">
                          {format(new Date(booking.bookingDate), "dd/MM/yyyy", { locale: vi })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Giờ Đặt</p>
                        <p className="font-medium">{booking.timeSlot}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Users className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Số Người</p>
                        <p className="font-medium">{booking.numberOfGuests} người</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <User className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Khách Đặt</p>
                        <p className="font-medium">{booking.customerName}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Số Điện Thoại</p>
                        <p className="font-medium">{booking.customerPhone}</p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-6 pt-4 border-t">
                    {booking.status === "BOOKED" && (
                      <Button
                        variant="outline"
                        className="text-red-600 border-red-600 hover:bg-red-50"
                        onClick={() => handleCancelBooking(booking)}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Hủy Đặt
                      </Button>
                    )}
                    <Button variant="outline" onClick={() => window.print()}>
                      In Xác Nhận
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {selectedBooking && (
              <CancelBookingDialog
                open={cancelDialogOpen}
                onOpenChange={setCancelDialogOpen}
                bookingId={selectedBooking.bookingId}
                customerPhone={selectedBooking.customerPhone}
                bookingDate={selectedBooking.bookingDate}
                timeSlot={selectedBooking.timeSlot}
                onConfirm={handleConfirmCancel}
                isPending={cancelMutation.isPending}
              />
            )}
          </div>
        )}

        {/* No Results */}
        {hasSearched && !searchMutation.isPending && searchResults.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700">Không Tìm Thấy Đặt Chỗ</h3>
              <p className="text-gray-500 mt-2">Không có đặt chỗ nào với số điện thoại này</p>
              <p className="text-sm text-gray-400 mt-4">
                💡 Vui lòng kiểm tra lại số điện thoại hoặc liên hệ quán để được hỗ trợ
              </p>
            </CardContent>
          </Card>
        )}

        {/* Initial State */}
        {!hasSearched && (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-700">Tìm Kiếm Đặt Chỗ</h3>
              <p className="text-gray-500 mt-2">Nhập số điện thoại bạn đã dùng khi đặt bàn để xem thông tin</p>
              <div className="mt-6 text-left bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-sm mb-2">📌 Lưu Ý:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Chỉ hiển thị đặt chỗ còn hiệu lực (không hủy)</li>
                  <li>• Vui lòng đến trước 15 phút so với giờ đặt</li>
                  <li>• Cần hủy trước 2 giờ nếu không đến được</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

// Helper function for cancel (có thể implement sau)
function handleCancelBooking(bookingId: string) {
  // Implement cancel logic here
  console.log("Cancel booking:", bookingId);
}
