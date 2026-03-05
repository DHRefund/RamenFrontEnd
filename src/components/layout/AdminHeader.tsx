import { Bell, User, ChevronDown, Settings, Sun, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { AdminUser } from "@/types/admin";

interface AdminHeaderProps {
  onLogout: () => void;
  currentUser: AdminUser | null;
}

export const AdminHeader = ({ onLogout, currentUser }: AdminHeaderProps) => {
  return (
    <header className="h-16 border-b bg-white flex items-center justify-between px-6 sticky top-0 z-40">
      <div>
        <h1 className="text-lg font-semibold">予約管理システム</h1>
        <p className="text-xs text-gray-500">{currentUser?.fullName || "管理者"}</p>
      </div>

      <div className="flex items-center space-x-4">
        {/* 通知 */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full" />
        </Button>

        {/* テーマ切替（任意） */}
        <Button variant="ghost" size="icon">
          <Sun className="w-5 h-5" />
        </Button>

        {/* ユーザーメニュー */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-medium hidden md:block">{currentUser?.fullName || "管理者"}</span>
              <ChevronDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{currentUser?.fullName}</p>
                <p className="text-xs text-gray-500">{currentUser?.username}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem>
              <User className="w-4 h-4 mr-2" />
              プロフィール
            </DropdownMenuItem>

            <DropdownMenuItem>
              <Settings className="w-4 h-4 mr-2" />
              設定
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem className="text-red-600" onClick={() => onLogout()}>
              <LogOut className="w-4 h-4 mr-2" />
              ログアウト
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
