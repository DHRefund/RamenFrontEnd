import { Clock, MapPin, Phone } from "lucide-react";

export const CustomerFooter = () => {
  return (
    <footer className="border-t bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 店舗情報 */}
          <div>
            <h3 className="font-bold text-lg mb-4 flex items-center">
              <span className="text-2xl mr-2">🍜</span>
              Sapporo Ramen
            </h3>
            <p className="text-gray-600 text-sm">本格的な札幌ラーメンの味をお届けします。</p>
          </div>

          {/* 営業時間 */}
          <div>
            <h4 className="font-semibold mb-4 flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              営業時間
            </h4>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>月曜日〜金曜日：11:00 - 14:00 / 18:00 - 22:00</li>
              <li>土曜日・日曜日：11:00 - 22:00</li>
            </ul>
          </div>

          {/* お問い合わせ */}
          <div>
            <h4 className="font-semibold mb-4 flex items-center">
              <Phone className="w-4 h-4 mr-2" />
              お問い合わせ
            </h4>
            <ul className="text-sm text-gray-600 space-y-2">
              <li className="flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                〒060-0001 北海道札幌市中央区〇〇1-2-3
              </li>
              <li>📞 090-0000-0000</li>
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
