"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";
import Cookies from "js-cookie"; // js-cookie kütüphanesini import ediyoruz
import { Sun, Moon } from "lucide-react";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    // Çerez onay durumunu kontrol et
    const cookieConsent = localStorage.getItem("cookieConsent");
    const consent = cookieConsent ? JSON.parse(cookieConsent) : null;

    // Eğer fonksiyonel çerezler kabul edilmediyse tema ayarı yapılmaz
    if (consent && consent.functionalCookies) {
      // Çerezden tema ayarını alıyoruz
      const storedTheme = Cookies.get("theme");
      if (storedTheme) {
        setTheme(storedTheme);
      } else {
        // Eğer tema yoksa varsayılan olarak light ayarlanır
        const defaultTheme = "light";
        setTheme(defaultTheme);
        Cookies.set("theme", defaultTheme); // Çereze varsayılan temayı kaydediyoruz
      }
    }
  }, [setTheme]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    Cookies.set("theme", newTheme); // Yeni temayı çereze kaydediyoruz
  };

  return (
    <button onClick={toggleTheme} className="flex items-center p-2">
      {theme === "light" ? (
        <Moon className="w-6 h-6" />
      ) : (
        <Sun className="w-6 h-6" />
      )}
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
