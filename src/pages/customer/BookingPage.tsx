import { useState } from "react";
import { format } from "date-fns";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { bookingService } from "@/services/bookingService";
import { BookingCalendar } from "@/components/booking/BookingCalendar";
import { TimeSlotSelector } from "@/components/booking/TimeSlotSelector";
import { BookingForm } from "@/components/booking/BookingForm";
import { BookingSummary } from "@/components/booking/BookingSummary";
import type { BookingRequest } from "@/types/booking";
import { useNavigate } from "react-router-dom";

export const BookingPage = () => {
  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [step, setStep] = useState(1); // 1: 日付選択, 2: 時間選択, 3: 情報入力

  /**
   * 日付が変更されたときに予約可能な時間枠を取得
   */
  const { data: scheduleData, isLoading: isLoadingSlots } = useQuery({
    queryKey: ["schedule", selectedDate],
    queryFn: () => {
      if (!selectedDate) return Promise.resolve({ date: "", slots: [] });
      return bookingService.getSchedule(format(selectedDate, "yyyy-MM-dd"));
    },
    enabled: !!selectedDate,
  });

  /**
   * 予約作成API
   */
  const createBookingMutation = useMutation({
    mutationFn: (data: BookingRequest) => bookingService.createBooking(data),

    /**
     * 予約成功時
     */
    onSuccess: (response) => {
      toast.success("🎉 予約が完了しました！");
      console.log("Booking created:", response);
      navigate(`/confirmation/${response.bookingId}`);
    },

    /**
     * エラー時
     */
    onError: (error: any) => {
      if (error.response?.status === 400) {
        toast.error("❌ この時間枠は満席です。別の時間を選択してください。");
      } else {
        toast.error("❌ エラーが発生しました。もう一度お試しください。");
      }
    },
  });

  /**
   * 日付選択処理
   */
  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedSlotId(null);

    if (date) setStep(2);
  };

  /**
   * 時間枠選択処理
   */
  const handleSlotSelect = (slotId: string) => {
    setSelectedSlotId(slotId);
    setStep(3);

    // フォーム位置までスクロール
    setTimeout(() => {
      document.getElementById("booking-form")?.scrollIntoView({
        behavior: "smooth",
      });
    }, 100);
  };

  /**
   * フォーム送信処理
   */
  const handleFormSubmit = (formData: any) => {
    if (!selectedDate || !selectedSlotId) {
      toast.error("日付と時間を選択してください");
      return;
    }

    const bookingRequest: BookingRequest = {
      customerName: formData.customerName,
      customerPhone: formData.customerPhone,
      customerEmail: formData.customerEmail,
      bookingDate: format(selectedDate, "yyyy-MM-dd"),
      timeSlotId: selectedSlotId,
      numberOfGuests: parseInt(formData.numberOfGuests),
    };

    createBookingMutation.mutate(bookingRequest);
  };

  /**
   * 選択された時間枠の情報を取得
   */
  const selectedSlot = scheduleData?.slots.find((s) => s.id === selectedSlotId);
  const selectedTime = selectedSlot?.time || "";

  return (
    <div className="container mx-auto px-4 py-8">
      {/* ステップ表示 */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex items-center justify-center space-x-4">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`flex items-center justify-center w-10 h-10 rounded-full ${
                step >= s ? "bg-red-600 text-white" : "bg-gray-200 text-gray-500"
              }`}
            >
              {s}
            </div>
          ))}
        </div>

        <div className="flex justify-center space-x-16 mt-2 text-sm">
          <span className={step >= 1 ? "text-red-600 font-medium" : "text-gray-500"}>日付選択</span>
          <span className={step >= 2 ? "text-red-600 font-medium" : "text-gray-500"}>時間選択</span>
          <span className={step >= 3 ? "text-red-600 font-medium" : "text-gray-500"}>情報入力</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
        {/* 左側：予約ステップ */}
        <div className="space-y-8">
          {/* Step 1: カレンダー */}
          <BookingCalendar selectedDate={selectedDate} onSelectDate={handleDateSelect} />

          {/* Step 2: 時間枠 */}
          {selectedDate && (
            <TimeSlotSelector
              slots={scheduleData?.slots || []}
              selectedSlot={selectedSlotId}
              onSelectSlot={handleSlotSelect}
              isLoading={isLoadingSlots}
            />
          )}

          {/* Step 3: フォーム */}
          {selectedSlotId && (
            <div id="booking-form">
              <BookingForm onSubmit={handleFormSubmit} isSubmitting={createBookingMutation.isPending} />
            </div>
          )}
        </div>

        {/* 右側：予約内容サマリー */}
        <div className="hidden md:block">
          <div className="sticky top-24">
            <BookingSummary
              date={selectedDate}
              timeSlot={selectedTime}
              numberOfGuests={watchNumberOfGuests() || "2"}
              customerName={watchCustomerName() || ""}
              customerPhone={watchCustomerPhone() || ""}
            />

            {/* 注意事項 */}
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-semibold text-yellow-800 mb-2">⚠️ 注意事項</h4>

              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• 予約時間から15分まで席を確保します</li>
                <li>• 来店できない場合は2時間前までにキャンセルしてください</li>
                <li>• 8名以上の団体は直接お電話ください</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * フォーム値取得用のダミー関数
 * TODO: React Hook Form の Context から取得するようにリファクタリング予定
 */
function watchNumberOfGuests() {
  return "2";
}

function watchCustomerName() {
  return "";
}

function watchCustomerPhone() {
  return "";
}
