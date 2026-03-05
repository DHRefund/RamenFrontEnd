import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { bookingService } from "@/services/bookingService";
import type { BookingDetailResponse } from "@/types/booking";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Calendar, Clock, Users, User, Printer, Mail, Phone, AlertCircle, Home } from "lucide-react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";

export const ConfirmationPage = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();

  const {
    data: booking,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["booking", bookingId],
    queryFn: () => {
      if (!bookingId) throw new Error("予約IDがありません");
      return bookingService.getBookingById(bookingId);
    },
    enabled: !!bookingId,
    retry: false,
    onError: () => {
      toast.error("❌ 予約情報が見つかりませんでした");
    },
  });

  const goHome = () => navigate("/");

  const handlePrint = () => {
    window.print();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "BOOKED":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200 px-3 py-1">
            <CheckCircle className="w-3 h-3 mr-1" />
            予約確定
          </Badge>
        );

      case "CANCELLED":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200 px-3 py-1">
            <AlertCircle className="w-3 h-3 mr-1" />
            キャンセル済み
          </Badge>
        );

      case "COMPLETED":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200 px-3 py-1">
            <CheckCircle className="w-3 h-3 mr-1" />
            来店済み
          </Badge>
        );

      default:
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200 px-3 py-1">{status}</Badge>;
    }
  };

  // Loading
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-lg mx-auto text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-red-600 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">予約情報を読み込み中...</p>
        </div>
      </div>
    );
  }

  // Error
  if (error || !booking) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-lg mx-auto">
          <Card className="border-2 border-red-200">
            <CardContent className="p-8 text-center space-y-6">
              <AlertCircle className="w-20 h-20 text-red-600 mx-auto" />

              <div>
                <h1 className="text-2xl font-bold text-red-600">予約が見つかりません</h1>
                <p className="text-gray-500 mt-2">予約IDが存在しないか、削除された可能性があります</p>
              </div>

              <div className="bg-gray-100 p-4 rounded-lg text-left space-y-2">
                <p className="text-sm text-gray-600">📋 考えられる原因:</p>

                <ul className="text-sm text-gray-500 space-y-1 ml-4">
                  <li>• 予約IDが間違っている</li>
                  <li>• 予約がキャンセルされた</li>
                  <li>• リンクの有効期限が切れている</li>
                </ul>
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" className="flex-1" onClick={() => navigate("/check-booking")}>
                  <Phone className="w-4 h-4 mr-2" />
                  予約確認
                </Button>

                <Button className="flex-1 bg-red-600 hover:bg-red-700" onClick={goHome}>
                  <Home className="w-4 h-4 mr-2" />
                  新しく予約する
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        {/* Success */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-16 h-16 text-green-600" />
          </div>

          <h1 className="text-3xl font-bold text-green-600">予約が完了しました！</h1>

          <p className="text-gray-500 mt-2">Sapporo Ramen をご予約いただきありがとうございます</p>
        </div>

        <Card className="border-2 border-green-200 shadow-lg">
          <CardContent className="p-8 space-y-6">
            {/* Booking ID */}
            <div className="text-center bg-gray-100 p-6 rounded-lg">
              <p className="text-sm text-gray-500 mb-2">予約番号</p>

              <p className="text-3xl font-bold text-red-600 tracking-wider">
                #{booking.bookingId.slice(-8).toUpperCase()}
              </p>

              <p className="text-xs text-gray-400 mt-1">(フルID: {booking.bookingId})</p>
            </div>

            {/* Status */}
            <div className="flex justify-center">{getStatusBadge(booking.status)}</div>

            {/* Booking Info */}
            <div className="space-y-4 pt-4 border-t">
              <h3 className="font-semibold text-lg text-gray-700">📋 予約情報</h3>

              <div className="grid gap-4">
                <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">予約日</p>
                    <p className="font-medium text-gray-900">
                      {format(new Date(booking.bookingDate + "T00:00:00"), "yyyy年MM月dd日 (EEEE)", { locale: ja })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Clock className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">時間</p>
                    <p className="font-medium text-gray-900">{booking.timeSlot}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Users className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">人数</p>
                    <p className="font-medium text-gray-900">{booking.numberOfGuests}名</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer */}
            <div className="space-y-4 pt-4 border-t">
              <h3 className="font-semibold text-lg text-gray-700">👤 お客様情報</h3>

              <div className="grid gap-4">
                <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <User className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">お名前</p>
                    <p className="font-medium text-gray-900">{booking.customerName}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Phone className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">電話番号</p>
                    <p className="font-medium text-gray-900">{booking.customerPhone}</p>
                  </div>
                </div>

                {booking.customerEmail && (
                  <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Mail className="w-5 h-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">メール</p>
                      <p className="font-medium text-gray-900">{booking.customerEmail}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Notes */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 space-y-2">
              <h4 className="font-semibold text-yellow-800 flex items-center">
                <AlertCircle className="w-4 h-4 mr-2" />
                ご注意
              </h4>

              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• 予約時間の15分前までにご来店ください</li>
                <li>• 予約時間から15分経過するとキャンセルになる場合があります</li>
                <li>• 来店できない場合は2時間前までにご連絡ください</li>
                <li>• 8名以上の予約はお電話ください</li>
              </ul>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <Button variant="outline" className="flex-1" onClick={handlePrint}>
                <Printer className="w-4 h-4 mr-2" />
                印刷
              </Button>

              <Button className="flex-1 bg-red-600 hover:bg-red-700" onClick={goHome}>
                <Home className="w-4 h-4 mr-2" />
                ホームへ
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <Link to="/check-booking" className="text-sm text-red-600 hover:text-red-700 underline">
            🔍 予約を確認する
          </Link>
        </div>
      </div>
    </div>
  );
};
