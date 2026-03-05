import { Calendar } from "@/components/ui/calendar";
import { addDays, format, isBefore, startOfDay } from "date-fns";
import { ja } from "date-fns/locale";

interface BookingCalendarProps {
  selectedDate: Date | undefined;
  onSelectDate: (date: Date | undefined) => void;
  minDate?: Date;
  maxDate?: Date;
}

export const BookingCalendar = ({
  selectedDate,
  onSelectDate,
  minDate = startOfDay(new Date()),
  maxDate = addDays(startOfDay(new Date()), 30),
}: BookingCalendarProps) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">📅 日付を選択</h3>
        <p className="text-sm text-gray-500">ご予約は最大30日先まで可能です。</p>
      </div>

      <div className="flex justify-center">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onSelectDate}
          disabled={(date) => {
            const today = startOfDay(new Date());
            return isBefore(date, today) || isBefore(maxDate, date);
          }}
          locale={ja}
          className="rounded-md border shadow"
        />
      </div>

      {selectedDate && (
        <div className="text-center p-4 bg-red-50 rounded-lg">
          <p className="text-red-600 font-medium">
            選択日:{" "}
            {format(selectedDate, "yyyy年MM月dd日 (EEEE)", {
              locale: ja,
            })}
          </p>
        </div>
      )}
    </div>
  );
};
