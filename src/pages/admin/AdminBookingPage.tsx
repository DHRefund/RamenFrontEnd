import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { toast } from "sonner";
import { bookingService } from "@/services/bookingService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CheckCircle, XCircle, Eye, Search, Calendar, Clock, Users, Phone, User } from "lucide-react";
import { AdminBookingDetail } from "@/types/admin";

export const AdminBookingsPage = () => {
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<AdminBookingDetail | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const { bookings, isLoading } = useQuery({
    queryKey: ["admin-bookings", selectedDate],
    queryFn: () => bookingService.getAllReservations(selectedDate),
  });

  const cancelMutation = useMutation({
    mutationFn: (id: string) => bookingService.cancelBooking({ bookingId: id, customerPhone: "" }),
    onSuccess: () => {
      toast.success("✅ Đã hủy đặt chỗ");
      queryClient.invalidateQueries({ queryKey: ["admin-bookings"] });
    },
    onError: () => {
      toast.error("❌ Không thể hủy đặt chỗ");
    },
  });

  const completeMutation = useMutation({
    mutationFn: (id: string) => fetch(`/api/admin/reservations/${id}/complete`, { method: "PATCH" }),
    onSuccess: () => {
      toast.success("✅ Đã đánh dấu hoàn thành");
      queryClient.invalidateQueries({ queryKey: ["admin-bookings"] });
    },
    onError: () => {
      toast.error("❌ Không thể cập nhật trạng thái");
    },
  });

  const filteredBookings = bookings?.filter(
    (booking: any) =>
      booking.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.customerPhone?.includes(searchTerm),
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "BOOKED":
        return <Badge className="bg-green-100 text-green-800">Đã Xác Nhận</Badge>;
      case "CANCELLED":
        return <Badge className="bg-red-100 text-red-800">Đã Hủy</Badge>;
      case "COMPLETED":
        return <Badge className="bg-blue-100 text-blue-800">Hoàn Thành</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Quản Lý Đặt Bàn</h1>
          <p className="text-gray-500">Xem và quản lý tất cả đặt chỗ</p>
        </div>
        <div className="flex gap-2">
          <Input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="w-40" />
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Tìm khách..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-60"
            />
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <Card>
        <CardHeader>
          <CardTitle>📋 Danh Sách Đặt Chỗ ({filteredBookings?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto" />
            </div>
          ) : filteredBookings && filteredBookings.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Giờ</TableHead>
                  <TableHead>Khách Hàng</TableHead>
                  <TableHead>SĐT</TableHead>
                  <TableHead>Số Người</TableHead>
                  <TableHead>Trạng Thái</TableHead>
                  <TableHead>Đặt Lúc</TableHead>
                  <TableHead>Hành Động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.map((booking: any) => (
                  <TableRow key={booking.bookingId}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        {booking.timeSlot || "N/A"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-500" />
                        {booking.customerName || "N/A"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-500" />
                        {booking.customerPhone || "N/A"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-500" />
                        {booking.numberOfGuests || "N/A"}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(booking.status)}</TableCell>
                    <TableCell>
                      {booking.createdAt ? format(new Date(booking.createdAt), "HH:mm dd/MM") : "N/A"}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedBooking(booking);
                            setDetailDialogOpen(true);
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        {booking.status === "BOOKED" && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-green-600"
                              onClick={() => completeMutation.mutate(booking.bookingId)}
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600"
                              onClick={() => cancelMutation.mutate(booking.bookingId)}
                            >
                              <XCircle className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-gray-500">Không có đặt chỗ nào</div>
          )}
        </CardContent>
      </Card>

      {/* Booking Detail Dialog */}
      {selectedBooking && (
        <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Chi Tiết Đặt Chỗ</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Khách Hàng</p>
                  <p className="font-medium">{selectedBooking.customerName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">SĐT</p>
                  <p className="font-medium">{selectedBooking.customerPhone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Ngày</p>
                  <p className="font-medium">{selectedBooking.bookingDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Giờ</p>
                  <p className="font-medium">{selectedBooking.timeSlot}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Số Người</p>
                  <p className="font-medium">{selectedBooking.numberOfGuests}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Trạng Thái</p>
                  <p className="font-medium">{getStatusBadge(selectedBooking.status)}</p>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
