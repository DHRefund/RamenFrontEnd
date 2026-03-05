import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, Users, User } from "lucide-react";

interface BookingSummaryProps {
  date: Date | undefined;
  timeSlot: string | null;
  numberOfGuests: string;
  customerName: string;
  customerPhone: string;
}

export const BookingSummary = ({
  date,
  timeSlot,
  numberOfGuests,
  customerName,
  customerPhone,
}: BookingSummaryProps) => {
  if (!date || !timeSlot) {
    return null;
  }

  return (
    <Card className="bg-gray-50 border-2 border-red-200">
      <CardContent className="p-6 space-y-4">
        <h3 className="text-lg font-semibold text-red-600">📋 予約内容の確認</h3>

        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <Calendar className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">📅 日付</p>
              <p className="font-medium">{format(date, "yyyy年MM月dd日", { locale: ja })}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Clock className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">⏰ 時間</p>
              <p className="font-medium">{timeSlot}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Users className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">👥 人数</p>
              <p className="font-medium">{numberOfGuests}名</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <User className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">🙋 ご予約者</p>
              <p className="font-medium">{customerName || "未入力"}</p>
              <p className="text-sm text-gray-500">{customerPhone || "未入力"}</p>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t text-sm text-gray-500 space-y-1">
          <p>💡 ご予約時間の15分前までにご来店ください。</p>
          <p>⏳ 15分を過ぎますとキャンセルとなる場合がございます。</p>
        </div>
      </CardContent>
    </Card>
  );
};
