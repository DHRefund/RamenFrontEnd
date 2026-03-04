import { format } from "date-fns";
import { vi } from "date-fns/locale";
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
        <h3 className="text-lg font-semibold text-red-600">📋 Tóm Tắt Đặt Bàn</h3>

        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <Calendar className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Ngày</p>
              <p className="font-medium">{format(date, "dd/MM/yyyy", { locale: vi })}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Clock className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Giờ</p>
              <p className="font-medium">{timeSlot}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Users className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Số Người</p>
              <p className="font-medium">{numberOfGuests} người</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <User className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Khách Đặt</p>
              <p className="font-medium">{customerName || "Chưa nhập"}</p>
              <p className="text-sm text-gray-500">{customerPhone || "Chưa nhập"}</p>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t text-sm text-gray-500">
          <p>💡 Vui lòng đến trước 15 phút để giữ chỗ</p>
          <p>⏰ Bàn sẽ được giữ trong 15 phút sau giờ đặt</p>
        </div>
      </CardContent>
    </Card>
  );
};
