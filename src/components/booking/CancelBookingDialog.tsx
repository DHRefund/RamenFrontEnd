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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center text-red-600">
            <AlertCircle className="w-5 h-5 mr-2" />
            Xác Nhận Hủy Đặt Bàn
          </DialogTitle>
          <DialogDescription>Vui lòng xác nhận thông tin trước khi hủy</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Thông tin booking */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <div className="flex items-center text-sm">
              <Calendar className="w-4 h-4 mr-2 text-gray-500" />
              <span>Mã đặt: #{bookingId.slice(-8).toUpperCase()}</span>
            </div>
            <div className="flex items-center text-sm">
              <Calendar className="w-4 h-4 mr-2 text-gray-500" />
              <span>Ngày: {bookingDate}</span>
            </div>
            <div className="flex items-center text-sm">
              <Clock className="w-4 h-4 mr-2 text-gray-500" />
              <span>Giờ: {timeSlot}</span>
            </div>
          </div>

          {/* Cảnh báo */}
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              ⚠️ Chỉ có thể hủy trước giờ đặt ít nhất <strong>2 giờ</strong>. Sau khi hủy, bàn sẽ được giải phóng cho
              khách khác.
            </AlertDescription>
          </Alert>

          {/* Lý do hủy (optional) */}
          <div className="space-y-2">
            <Label htmlFor="cancelReason">Lý Do Hủy (Tùy chọn)</Label>
            <Textarea
              id="cancelReason"
              placeholder="Vui lòng cho chúng tôi biết lý do hủy..."
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>

          {/* Xác thực số điện thoại */}
          <div className="space-y-2">
            <Label htmlFor="confirmPhone">Xác Nhận Số Điện Thoại *</Label>
            <input
              id="confirmPhone"
              type="tel"
              placeholder="Nhập lại số điện thoại của bạn"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              defaultValue={customerPhone}
              readOnly
            />
            <p className="text-xs text-gray-500">Số điện thoại này sẽ được dùng để xác thực chủ đặt chỗ</p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose}>
            Quay Lại
          </Button>
          <Button variant="destructive" onClick={handleConfirm} disabled={isPending}>
            {isPending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Đang Xử Lý...
              </>
            ) : (
              <>
                <AlertCircle className="w-4 h-4 mr-2" />
                Xác Nhận Hủy
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
