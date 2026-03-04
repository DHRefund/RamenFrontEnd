import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const bookingFormSchema = z.object({
  customerName: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
  customerPhone: z.string().regex(/^0[0-9]{9}$/, "Số điện thoại không hợp lệ"),
  customerEmail: z.string().email("Email không hợp lệ").optional().or(z.literal("")),
  numberOfGuests: z.string().min(1, "Vui lòng chọn số người"),
});

type BookingFormValues = z.infer<typeof bookingFormSchema>;

interface BookingFormProps {
  onSubmit: (data: BookingFormValues) => void;
  isSubmitting?: boolean;
}

export const BookingForm = ({ onSubmit, isSubmitting = false }: BookingFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      customerName: "POROCIA",
      customerPhone: "0912345678",
      customerEmail: "porocia@example.com",
      numberOfGuests: "2",
    },
  });

  const numberOfGuests = watch("numberOfGuests");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">👤 Thông Tin Khách Hàng</h3>

        <div className="space-y-4">
          {/* Họ tên */}
          <div>
            <Label htmlFor="customerName">Họ và Tên *</Label>
            <Input
              id="customerName"
              placeholder="Nguyễn Văn A"
              {...register("customerName")}
              className={errors.customerName ? "border-red-500" : ""}
            />
            {errors.customerName && <p className="text-sm text-red-500 mt-1">{errors.customerName.message}</p>}
          </div>

          {/* Số điện thoại */}
          <div>
            <Label htmlFor="customerPhone">Số Điện Thoại *</Label>
            <Input
              id="customerPhone"
              placeholder="0909xxxxxx"
              {...register("customerPhone")}
              className={errors.customerPhone ? "border-red-500" : ""}
            />
            {errors.customerPhone && <p className="text-sm text-red-500 mt-1">{errors.customerPhone.message}</p>}
          </div>

          {/* Email (Optional) */}
          <div>
            <Label htmlFor="customerEmail">Email (Tùy chọn)</Label>
            <Input
              id="customerEmail"
              type="email"
              placeholder="example@email.com"
              {...register("customerEmail")}
              className={errors.customerEmail ? "border-red-500" : ""}
            />
            {errors.customerEmail && <p className="text-sm text-red-500 mt-1">{errors.customerEmail.message}</p>}
          </div>

          {/* Số người */}
          <div>
            <Label htmlFor="numberOfGuests">Số Người *</Label>
            <Select value={numberOfGuests} onValueChange={(value) => setValue("numberOfGuests", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn số người" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num} {num === 1 ? "người" : "người"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={isSubmitting}>
        {isSubmitting ? "Đang xử lý..." : "Xác Nhận Đặt Bàn"}
      </Button>
    </form>
  );
};
