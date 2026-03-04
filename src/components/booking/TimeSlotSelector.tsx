import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { TimeSlot } from "@/types/booking";

interface TimeSlotSelectorProps {
  slots: TimeSlot[];
  selectedSlot: string | null;
  onSelectSlot: (slotId: string) => void;
  isLoading?: boolean;
}

export const TimeSlotSelector = ({ slots, selectedSlot, onSelectSlot, isLoading = false }: TimeSlotSelectorProps) => {
  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto" />
        <p className="text-gray-500 mt-2">Đang tải khung giờ...</p>
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg">
        <p className="text-gray-500">Không có khung giờ nào khả dụng</p>
      </div>
    );
  }

  // Nhóm slot theo buổi (Sáng/Chiều/Tối)
  const morningSlots = slots.filter((s) => {
    const hour = parseInt(s.time.split(":")[0]);
    return hour >= 11 && hour < 14;
  });

  const eveningSlots = slots.filter((s) => {
    const hour = parseInt(s.time.split(":")[0]);
    return hour >= 18 && hour < 22;
  });

  const renderSlotButton = (slot: TimeSlot) => {
    const isAvailable = slot.available;
    const isSelected = selectedSlot === slot.id;
    const remainingSeats = slot.maxCapacity - slot.bookedCount;

    return (
      <Button
        key={slot.id}
        variant={isSelected ? "default" : isAvailable ? "outline" : "secondary"}
        disabled={!isAvailable}
        onClick={() => isAvailable && onSelectSlot(slot.id)}
        className={cn(
          "w-full h-auto py-3 flex flex-col items-center justify-center",
          isSelected && "bg-red-600 hover:bg-red-700 text-white",
          !isAvailable && "opacity-50 cursor-not-allowed bg-gray-200",
        )}
      >
        <span className="text-lg font-semibold">{slot.time}</span>
        <span className="text-xs mt-1">
          {isAvailable ? (
            <span className="text-green-600">Còn {remainingSeats} chỗ</span>
          ) : (
            <span className="text-red-600">Hết chỗ</span>
          )}
        </span>
      </Button>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">⏰ Chọn Khung Giờ</h3>
        <p className="text-sm text-gray-500">Chọn khung giờ phù hợp với bạn</p>
      </div>

      {/* Buổi trưa */}
      {morningSlots.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-600 mb-3">🌞 Buổi Trưa (11:00 - 14:00)</h4>
          <div className="grid grid-cols-3 md:grid-cols-4 gap-3">{morningSlots.map(renderSlotButton)}</div>
        </div>
      )}

      {/* Buổi tối */}
      {eveningSlots.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-600 mb-3">🌙 Buổi Tối (18:00 - 22:00)</h4>
          <div className="grid grid-cols-3 md:grid-cols-4 gap-3">{eveningSlots.map(renderSlotButton)}</div>
        </div>
      )}
    </div>
  );
};
