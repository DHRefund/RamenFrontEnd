import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { authService } from "@/services/authService";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Utensils, Lock, User } from "lucide-react";

/**
 * ログインフォームのバリデーションスキーマ
 */
const loginFormSchema = z.object({
  username: z.string().min(3, "ユーザー名は3文字以上で入力してください"),
  password: z.string().min(6, "パスワードは6文字以上で入力してください"),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

export const AdminLoginPage = () => {
  const navigate = useNavigate();

  /**
   * react-hook-form の設定
   */
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: "admin",
      password: "admin123",
    },
  });

  /**
   * ログインAPI呼び出し
   */
  const loginMutation = useMutation({
    mutationFn: (payload: LoginFormValues) => authService.login(payload),

    /**
     * ログイン成功時
     */
    onSuccess: (response) => {
      console.log("Login response:", response);
      toast.success(`👋 ${response.username}さん、ようこそ！`);
      navigate("/admin");
    },

    /**
     * ログイン失敗時
     */
    onError: (error: any) => {
      const message = error.response?.data?.error || "❌ ログインに失敗しました";
      toast.error(message);
    },
  });

  /**
   * フォーム送信処理
   */
  const onSubmit = (formData: LoginFormValues) => {
    loginMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
              <Utensils className="w-8 h-8 text-white" />
            </div>
          </div>

          <CardTitle className="text-2xl">管理者ダッシュボード</CardTitle>
          <CardDescription>予約管理のためログインしてください</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* ユーザー名 */}
            <div className="space-y-2">
              <Label htmlFor="username">ユーザー名</Label>

              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                <Input id="username" placeholder="admin" className="pl-10" {...register("username")} />
              </div>

              {errors.username && <p className="text-sm text-red-500">{errors.username.message}</p>}
            </div>

            {/* パスワード */}
            <div className="space-y-2">
              <Label htmlFor="password">パスワード</Label>

              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                <Input id="password" type="password" placeholder="••••••" className="pl-10" {...register("password")} />
              </div>

              {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
            </div>

            {/* ログインボタン */}
            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={loginMutation.isPending}>
              {loginMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  ログイン中...
                </>
              ) : (
                "ログイン"
              )}
            </Button>
          </form>

          {/* デフォルトアカウント表示 */}
          <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
            <p className="font-medium">📝 デフォルトアカウント</p>
            <p>
              Username: <code className="bg-gray-200 px-2 py-1 rounded">admin</code>
            </p>
            <p>
              Password: <code className="bg-gray-200 px-2 py-1 rounded">admin123</code>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
