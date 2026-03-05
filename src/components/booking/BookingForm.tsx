import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const bookingFormSchema = z.object({
  customerName: z.string().min(2, "お名前は2文字以上で入力してください。"),
  customerPhone: z.string().regex(/^0[0-9]{9}$/, "電話番号の形式が正しくありません。（例：09012345678）"),
  customerEmail: z.string().email("メールアドレスの形式が正しくありません。").optional().or(z.literal("")),
  numberOfGuests: z.string().min(1, "人数を選択してください。"),
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
      customerName: "",
      customerPhone: "",
      customerEmail: "",
      numberOfGuests: "2",
    },
  });

  const numberOfGuests = watch("numberOfGuests");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">お客様情報</h3>

        <div className="space-y-4">
          <div>
            <Label htmlFor="customerName">お名前 *</Label>
            <Input
              id="customerName"
              placeholder="山田 太郎"
              {...register("customerName")}
              className={errors.customerName ? "border-red-500" : ""}
            />
            {errors.customerName && <p className="text-sm text-red-500 mt-1">{errors.customerName.message}</p>}
          </div>

          <div>
            <Label htmlFor="customerPhone">電話番号 *</Label>
            <Input
              id="customerPhone"
              placeholder="09012345678"
              {...register("customerPhone")}
              className={errors.customerPhone ? "border-red-500" : ""}
            />
            {errors.customerPhone && <p className="text-sm text-red-500 mt-1">{errors.customerPhone.message}</p>}
          </div>

          <div>
            <Label htmlFor="customerEmail">メールアドレス（任意）</Label>
            <Input
              id="customerEmail"
              type="email"
              placeholder="example@email.com"
              {...register("customerEmail")}
              className={errors.customerEmail ? "border-red-500" : ""}
            />
            {errors.customerEmail && <p className="text-sm text-red-500 mt-1">{errors.customerEmail.message}</p>}
          </div>

          <div>
            <Label htmlFor="numberOfGuests">人数 *</Label>
            <Select value={numberOfGuests} onValueChange={(value) => setValue("numberOfGuests", value)}>
              <SelectTrigger>
                <SelectValue placeholder="人数を選択してください" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num}名
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={isSubmitting}>
        {isSubmitting ? "処理中..." : "予約を確定する"}
      </Button>
    </form>
  );
};
