import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { toast } from "sonner";
import { bookingService } from "@/services/bookingService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CheckCircle, XCircle, Eye, Search, Clock, Users, Phone, User } from "lucide-react";
import { AdminBookingDetail } from "@/types/admin";

export const AdminBookingsPage = () => {
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<AdminBookingDetail | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  const queryClient = useQueryClient();

  // 指定した日付の予約一覧を取得
  const { data: bookings, isLoading } = useQuery({
    queryKey: ["admin-bookings", selectedDate],
    queryFn: () => bookingService.getAllReservations(selectedDate),
  });

  // 予約キャンセル処理
  const cancelMutation = useMutation({
    mutationFn: (id: string) => bookingService.cancelBooking({ bookingId: id, customerPhone: "" }),
    onSuccess: () => {
      toast.success("✅ 予約をキャンセルしました");
      // キャッシュを更新して一覧を再取得
      queryClient.invalidateQueries({ queryKey: ["admin-bookings"] });
    },
    onError: () => {
      toast.error("❌ 予約のキャンセルに失敗しました");
    },
  });

  // 来店完了処理
  const completeMutation = useMutation({
    mutationFn: (id: string) =>
      fetch(`/api/admin/reservations/${id}/complete`, {
        method: "PATCH",
      }),
    onSuccess: () => {
      toast.success("✅ 来店完了として更新しました");
      queryClient.invalidateQueries({ queryKey: ["admin-bookings"] });
    },
    onError: () => {
      toast.error("❌ ステータス更新に失敗しました");
    },
  });

  // 顧客名または電話番号で検索フィルタ
  const filteredBookings = bookings?.filter(
    (booking: any) =>
      booking.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.customerPhone?.includes(searchTerm),
  );

  // 予約ステータス表示
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "BOOKED":
        return <Badge className="bg-green-100 text-green-800">予約済み</Badge>;
      case "CANCELLED":
        return <Badge className="bg-red-100 text-red-800">キャンセル</Badge>;
      case "COMPLETED":
        return <Badge className="bg-blue-100 text-blue-800">来店完了</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">予約管理</h1>
          <p className="text-gray-500">すべての予約を確認・管理できます</p>
        </div>

        <div className="flex gap-2">
          <Input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="w-40" />

          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
            <Input
              placeholder="顧客検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-60"
            />
          </div>
        </div>
      </div>

      {/* 予約一覧テーブル */}
      <Card>
        <CardHeader>
          <CardTitle>📋 予約一覧 ({filteredBookings?.length || 0})</CardTitle>
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
                  <TableHead>時間</TableHead>
                  <TableHead>顧客名</TableHead>
                  <TableHead>電話番号</TableHead>
                  <TableHead>人数</TableHead>
                  <TableHead>ステータス</TableHead>
                  <TableHead>予約作成</TableHead>
                  <TableHead>操作</TableHead>
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
                      {booking.createdAt ? format(new Date(booking.createdAt), "HH:mm dd/MM", { locale: ja }) : "N/A"}
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
            <div className="text-center py-8 text-gray-500">予約はありません</div>
          )}
        </CardContent>
      </Card>

      {/* 予約詳細ダイアログ */}
      {selectedBooking && (
        <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>予約詳細</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">顧客名</p>
                  <p className="font-medium">{selectedBooking.customerName}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">電話番号</p>
                  <p className="font-medium">{selectedBooking.customerPhone}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">日付</p>
                  <p className="font-medium">{selectedBooking.bookingDate}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">時間</p>
                  <p className="font-medium">{selectedBooking.timeSlot}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">人数</p>
                  <p className="font-medium">{selectedBooking.numberOfGuests}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">ステータス</p>
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
