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
  const [step, setStep] = useState(1); // 1: Date, 2: Time, 3: Form

  // Fetch slots when date changes
  const { data: scheduleData, isLoading: isLoadingSlots } = useQuery({
    queryKey: ["schedule", selectedDate],
    queryFn: () => {
      if (!selectedDate) return Promise.resolve({ date: "", slots: [] });
      return bookingService.getSchedule(format(selectedDate, "yyyy-MM-dd"));
    },
    enabled: !!selectedDate,
  });

  // Create booking mutation
  const createBookingMutation = useMutation({
    mutationFn: (data: BookingRequest) => bookingService.createBooking(data),
    onSuccess: (response) => {
      toast.success("🎉 Đặt bàn thành công!");
      console.log("Booking created:", response);
      navigate(`/confirmation/${response.bookingId}`);
    },
    onError: (error: any) => {
      if (error.response?.status === 400) {
        toast.error("❌ Khung giờ đã hết chỗ. Vui lòng chọn giờ khác.");
      } else {
        toast.error("❌ Có lỗi xảy ra. Vui lòng thử lại.");
      }
    },
  });

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedSlotId(null);
    if (date) setStep(2);
  };

  const handleSlotSelect = (slotId: string) => {
    setSelectedSlotId(slotId);
    setStep(3);
    // Scroll to form
    setTimeout(() => {
      document.getElementById("booking-form")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleFormSubmit = (formData: any) => {
    if (!selectedDate || !selectedSlotId) {
      toast.error("Vui lòng chọn ngày và giờ");
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

  // Get selected slot info
  const selectedSlot = scheduleData?.slots.find((s) => s.id === selectedSlotId);
  const selectedTime = selectedSlot?.time || "";

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Progress Steps */}
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
          <span className={step >= 1 ? "text-red-600 font-medium" : "text-gray-500"}>Chọn Ngày</span>
          <span className={step >= 2 ? "text-red-600 font-medium" : "text-gray-500"}>Chọn Giờ</span>
          <span className={step >= 3 ? "text-red-600 font-medium" : "text-gray-500"}>Thông Tin</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
        {/* Left Column - Booking Steps */}
        <div className="space-y-8">
          {/* Step 1: Calendar */}
          <BookingCalendar selectedDate={selectedDate} onSelectDate={handleDateSelect} />

          {/* Step 2: Time Slots */}
          {selectedDate && (
            <TimeSlotSelector
              slots={scheduleData?.slots || []}
              selectedSlot={selectedSlotId}
              onSelectSlot={handleSlotSelect}
              isLoading={isLoadingSlots}
            />
          )}

          {/* Step 3: Form */}
          {selectedSlotId && (
            <div id="booking-form">
              <BookingForm onSubmit={handleFormSubmit} isSubmitting={createBookingMutation.isPending} />
            </div>
          )}
        </div>

        {/* Right Column - Summary (Sticky) */}
        <div className="hidden md:block">
          <div className="sticky top-24">
            <BookingSummary
              date={selectedDate}
              timeSlot={selectedTime}
              numberOfGuests={watchNumberOfGuests() || "2"}
              customerName={watchCustomerName() || ""}
              customerPhone={watchCustomerPhone() || ""}
            />

            {/* Lưu ý */}
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Lưu Ý</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Bàn được giữ tối đa 15 phút sau giờ đặt</li>
                <li>• Vui lòng gọi hủy trước 2 giờ nếu không đến</li>
                <li>• Nhóm trên 8 người vui lòng gọi trực tiếp</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper functions to watch form values (cần refactor để lấy từ form context)
function watchNumberOfGuests() {
  return "2";
}
function watchCustomerName() {
  return "";
}
function watchCustomerPhone() {
  return "";
}
