import { Clock, MapPin, Phone } from "lucide-react";

export const CustomerFooter = () => {
  return (
    <footer className="border-t bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Thông tin quán */}
          <div>
            <h3 className="font-bold text-lg mb-4 flex items-center">
              <span className="text-2xl mr-2">🍜</span>
              Sapporo Ramen
            </h3>
            <p className="text-gray-600 text-sm">Hương vị ramen truyền thống Nhật Bản giữa lòng thành phố.</p>
          </div>

          {/* Giờ mở cửa */}
          <div>
            <h4 className="font-semibold mb-4 flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              Giờ Mở Cửa
            </h4>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>Thứ 2 - Thứ 6: 11:00 - 14:00, 18:00 - 22:00</li>
              <li>Thứ 7 - CN: 11:00 - 22:00</li>
            </ul>
          </div>

          {/* Liên hệ */}
          <div>
            <h4 className="font-semibold mb-4 flex items-center">
              <Phone className="w-4 h-4 mr-2" />
              Liên Hệ
            </h4>
            <ul className="text-sm text-gray-600 space-y-2">
              <li className="flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                123 Đường ABC, Quận 1, TP.HCM
              </li>
              <li>📞 0909 xxx xxx</li>
              <li>📧 contact@sappororamen.com</li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-gray-500">
          © 2024 Sapporo Ramen. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
