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
        <p className="text-gray-500 mt-2">時間枠を読み込み中...</p>
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg">
        <p className="text-gray-500">現在ご利用可能な時間枠はありません</p>
      </div>
    );
  }

  // 昼・夜で分類
  const lunchSlots = slots.filter((s) => {
    const hour = parseInt(s.time.split(":")[0]);
    return hour >= 11 && hour < 14;
  });

  const dinnerSlots = slots.filter((s) => {
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
            <span className="text-green-600">残り{remainingSeats}席</span>
          ) : (
            <span className="text-red-600">満席</span>
          )}
        </span>
      </Button>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">⏰ 時間を選択</h3>
        <p className="text-sm text-gray-500">ご希望の時間帯をお選びください</p>
      </div>

      {/* ランチ */}
      {lunchSlots.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-600 mb-3">🌞 ランチ（11:00 - 14:00）</h4>
          <div className="grid grid-cols-3 md:grid-cols-4 gap-3">{lunchSlots.map(renderSlotButton)}</div>
        </div>
      )}

      {/* ディナー */}
      {dinnerSlots.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-600 mb-3">🌙 ディナー（18:00 - 22:00）</h4>
          <div className="grid grid-cols-3 md:grid-cols-4 gap-3">{dinnerSlots.map(renderSlotButton)}</div>
        </div>
      )}
    </div>
  );
};
