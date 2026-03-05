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
import { ja } from "date-fns/locale";
import type { CancelBookingRequest } from "../../types/booking";
import { CancelBookingDialog } from "../../components/booking/CancelBookingDialog";

const searchFormSchema = z.object({
  phone: z
    .string()
    .min(10, "電話番号は10桁以上で入力してください")
    .regex(/^0[0-9]{9}$/, "正しい電話番号を入力してください（090xxxxxxxx）"),
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
      const message = error.response?.data?.message || "❌ キャンセル処理中にエラーが発生しました";
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
        toast.info("📋 この電話番号の予約は見つかりませんでした");
      } else {
        toast.success(`✅ ${data.length}件の予約が見つかりました`);
      }
    },
    onError: () => {
      toast.error("❌ 検索中にエラーが発生しました");
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
            予約確定
          </Badge>
        );

      case "CANCELLED":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            <XCircle className="w-3 h-3 mr-1" />
            キャンセル済み
          </Badge>
        );

      case "COMPLETED":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            完了
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
          <h1 className="text-3xl font-bold text-gray-900">🔍 予約確認</h1>
          <p className="text-gray-500">電話番号を入力して予約情報を検索してください</p>
        </div>

        {/* Search Form */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <form onSubmit={handleSubmit(handleSearch)} className="space-y-4">
              <div>
                <Label htmlFor="phone">電話番号 *</Label>

                <div className="flex gap-2">
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="090xxxxxxxx"
                    {...register("phone")}
                    className={errors.phone ? "border-red-500" : ""}
                  />

                  <Button type="submit" className="bg-red-600 hover:bg-red-700" disabled={searchMutation.isPending}>
                    {searchMutation.isPending ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    ) : (
                      <>
                        <Search className="w-4 h-4 mr-2" />
                        検索
                      </>
                    )}
                  </Button>
                </div>

                {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>}
              </div>
            </form>

            {hasSearched && (
              <Button variant="outline" onClick={handleReset} className="w-full">
                別の検索
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Loading */}
        {searchMutation.isPending && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto" />
            <p className="text-gray-500 mt-4">検索中...</p>
          </div>
        )}

        {/* Results */}
        {hasSearched && !searchMutation.isPending && searchResults.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">📋 検索結果（{searchResults.length}件）</h2>

            {searchResults.map((booking) => (
              <Card key={booking.bookingId} className="border-l-4 border-l-red-600">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">予約番号: #{booking.bookingId.slice(-8).toUpperCase()}</h3>

                      <p className="text-sm text-gray-500">
                        予約作成日: {format(new Date(booking.createdAt), "yyyy/MM/dd HH:mm", { locale: ja })}
                      </p>
                    </div>

                    {getStatusBadge(booking.status)}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">予約日</p>
                        <p className="font-medium">
                          {format(new Date(booking.bookingDate), "yyyy/MM/dd", { locale: ja })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">時間</p>
                        <p className="font-medium">{booking.timeSlot}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Users className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">人数</p>
                        <p className="font-medium">{booking.numberOfGuests}名</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <User className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">予約者</p>
                        <p className="font-medium">{booking.customerName}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">電話番号</p>
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
                        予約をキャンセル
                      </Button>
                    )}

                    <Button variant="outline" onClick={() => window.print()}>
                      予約確認を印刷
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

              <h3 className="text-lg font-semibold text-gray-700">予約が見つかりません</h3>

              <p className="text-gray-500 mt-2">この電話番号での予約は見つかりませんでした</p>

              <p className="text-sm text-gray-400 mt-4">💡 電話番号をご確認いただくか、店舗へお問い合わせください</p>
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

              <h3 className="text-lg font-semibold text-gray-700">予約検索</h3>

              <p className="text-gray-500 mt-2">予約時に使用した電話番号を入力してください</p>

              <div className="mt-6 text-left bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-sm mb-2">📌 ご注意:</h4>

                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 有効な予約のみ表示されます</li>
                  <li>• 予約時間の15分前までにご来店ください</li>
                  <li>• キャンセルは2時間前まで可能です</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
