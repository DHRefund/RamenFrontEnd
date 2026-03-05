import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AlertCircle, Clock, Calendar } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface CancelBookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookingId: string;
  customerPhone: string;
  bookingDate: string;
  timeSlot: string;
  onConfirm: (reason: string) => void;
  isPending: boolean;
}

export const CancelBookingDialog = ({
  open,
  onOpenChange,
  bookingId,
  customerPhone,
  bookingDate,
  timeSlot,
  onConfirm,
  isPending,
}: CancelBookingDialogProps) => {
  const [cancelReason, setCancelReason] = useState("");

  const handleConfirm = () => {
    onConfirm(cancelReason);
    setCancelReason("");
  };

  const handleClose = () => {
    setCancelReason("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-red-50 border-red-200 shadow-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center text-red-600">
            <AlertCircle className="w-5 h-5 mr-2" />
            ご予約キャンセルの確認
          </DialogTitle>

          <DialogDescription className="text-gray-600">キャンセル前に内容をご確認ください。</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* 予約情報 */}
          <div className="bg-white border rounded-lg p-4 space-y-2 shadow-sm">
            <div className="flex items-center text-sm">
              <Calendar className="w-4 h-4 mr-2 text-gray-500" />
              <span>予約番号: #{bookingId.slice(-8).toUpperCase()}</span>
            </div>

            <div className="flex items-center text-sm">
              <Calendar className="w-4 h-4 mr-2 text-gray-500" />
              <span>日付: {bookingDate}</span>
            </div>

            <div className="flex items-center text-sm">
              <Clock className="w-4 h-4 mr-2 text-gray-500" />
              <span>時間: {timeSlot}</span>
            </div>
          </div>

          {/* 注意 */}
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              ⚠️ ご予約時間の<strong>2時間前まで</strong>キャンセル可能です。
              キャンセル後はお席が他のお客様へ開放されます。
            </AlertDescription>
          </Alert>

          {/* キャンセル理由 */}
          <div className="space-y-2">
            <Label htmlFor="cancelReason">キャンセル理由（任意）</Label>

            <Textarea
              id="cancelReason"
              placeholder="キャンセル理由をご記入ください..."
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              rows={3}
              className="resize-none bg-white"
            />
          </div>

          {/* 電話番号確認 */}
          <div className="space-y-2">
            <Label htmlFor="confirmPhone">電話番号確認 *</Label>

            <input
              id="confirmPhone"
              type="tel"
              className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm"
              defaultValue={customerPhone}
              readOnly
            />

            <p className="text-xs text-gray-500">ご予約者様確認のための電話番号です。</p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose}>
            戻る
          </Button>

          <Button variant="destructive" onClick={handleConfirm} disabled={isPending}>
            {isPending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                処理中...
              </>
            ) : (
              <>
                <AlertCircle className="w-4 h-4 mr-2" />
                キャンセルする
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
