import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Calendar, Settings, LogOut, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

interface AdminSidebarProps {
  onLogout: () => void;
  isOpen: boolean;
}

const menuItems = [
  { path: "/admin", icon: LayoutDashboard, label: "ダッシュボード" },
  { path: "/admin/bookings", icon: Calendar, label: "予約管理" },
  { path: "/admin/customers", icon: Users, label: "顧客管理" },
  { path: "/admin/settings", icon: Settings, label: "設定" },
];

export const AdminSidebar = ({ onLogout, isOpen }: AdminSidebarProps) => {
  const location = useLocation();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutDialog(true);
  };

  const confirmLogout = () => {
    setShowLogoutDialog(false);
    onLogout();
  };

  return (
    <>
      <aside
        className={`${isOpen ? "w-64" : "w-20"} border-r bg-white h-screen sticky top-0 transition-all duration-300 relative flex flex-col`}
      >
        <div className="p-6">
          <Link to="/admin" className="flex items-center space-x-2">
            <span className="text-2xl">🍜</span>
            {isOpen && <span className="font-bold text-lg">管理パネル</span>}
          </Link>
        </div>

        <nav className="px-4 space-y-2 flex-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive ? "bg-red-600 text-white" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Icon className="w-5 h-5" />
                {isOpen && <span className="font-medium">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-4">
          <Button
            variant="outline"
            className={`w-full justify-start text-red-600 border-red-600 hover:bg-red-50 ${
              !isOpen && "justify-center"
            }`}
            onClick={handleLogoutClick}
          >
            <LogOut className="w-5 h-5" />
            {isOpen && <span className="ml-2">ログアウト</span>}
          </Button>
        </div>
      </aside>

      {/* ログアウト確認ダイアログ */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>ログアウトの確認</AlertDialogTitle>
            <AlertDialogDescription>
              ログアウトしてもよろしいですか？ 再度管理画面にアクセスするには、ログインが必要です。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>戻る</AlertDialogCancel>
            <AlertDialogAction onClick={confirmLogout} className="bg-red-600 hover:bg-red-700">
              ログアウト
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
