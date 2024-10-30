import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const CountdownTimer: React.FC = () => {
  const targetDate: Date = new Date(Date.UTC(2025, 5, 14, 10, 15)); // 14 Haziran 2025, 10:15 UTC
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
  }>({ days: 0, hours: 0, minutes: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date(); // Şu anki tarihi al
      const distance = targetDate.getTime() - now.getTime(); // Hedef tarihe kalan süreyi hesapla

      if (distance < 0) {
        clearInterval(interval); // Zaman dolduğunda aralığı temizle
        setTimeLeft({ days: 0, hours: 0, minutes: 0 }); // Zaman doldu mesajı göster
      } else {
        // Kalan süreyi gün, saat ve dakika cinsine çevir
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

        setTimeLeft({ days, hours, minutes });
      }
    }, 1000);

    return () => clearInterval(interval); // Temizleme işlemi
  }, [targetDate]);

  return (
    <div className="flex justify-center mt-4 ">
      <Card className="w-full">
        {" "}
        {/* Genişlik ayarı için w-full eklendi */}
        <CardHeader>
          <CardTitle className="text-center">YKS'ye Kalan</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-between">
          {/* Gün Kartı */}
          <div className="text-center">
            <h2 className="text-lg font-bold">{timeLeft.days}</h2>
            <p className="text-sm text-gray-500">Gün</p>
          </div>

          {/* Saat Kartı */}
          <div className="text-center">
            <h2 className="text-lg font-bold">{timeLeft.hours}</h2>
            <p className="text-sm text-gray-500">Saat</p>
          </div>

          {/* Dakika Kartı */}
          <div className="text-center">
            <h2 className="text-lg font-bold">{timeLeft.minutes}</h2>
            <p className="text-sm text-gray-500">Dakika</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CountdownTimer;
