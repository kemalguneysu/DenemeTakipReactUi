import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { toast } from "@/hooks/use-toast";
import SpinnerMethodComponent from "@/app/spinner/spinnerForMethods";

export default function HandleCookie() {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false); 
  const [cookiePreferences, setCookiePreferences] = useState({
    essentialCookies: true, // Assuming essential cookies are always enabled
    functionalCookies: false,
    marketingCookies: false,
  });

  useEffect(() => {
    setLoading(true);
    const consent = localStorage.getItem("cookieConsent");
    if (consent) {
      const preferences = JSON.parse(consent);
      setCookiePreferences((prev) => ({
        essentialCookies: prev.essentialCookies, 
        functionalCookies: preferences.functionalCookies || false,
        marketingCookies: preferences.marketingCookies || false,
      }));
    }
    setLoading(false);
  }, []);

  const handleSavePreferences = async () => {
    setLoading(true);
    localStorage.setItem("cookieConsent", JSON.stringify(cookiePreferences));
    toast({
      title: "Başarılı",
      description: "Çerez tercihleriniz güncellenmiştir.",
    });
    setLoading(false);

  };

 const handleAcceptAll = async() => {
    setLoading(true);
   const preferences = {
     essentialCookies: true, 
     functionalCookies: true,
     marketingCookies: true,
   };
   localStorage.setItem("cookieConsent", JSON.stringify(preferences));
   setCookiePreferences(preferences);
   toast({
     title: "Başarılı",
     description: "Çerez tercihleriniz başarıyla güncellenmiştir.",
   });
    setLoading(false);

 };

  return (
    <div className={`max-w-md mx-auto p-4 border rounded-lg shadow-md`}>
      {loading && <SpinnerMethodComponent />}

      <h2 className="text-lg font-semibold mb-4">Çerez Ayarları</h2>
      <div className="mt-4">
        <div className="flex items-center justify-between">
          <span>Zorunlu Çerezler</span>
          <Switch checked disabled />{" "}
          {/* Always enabled and cannot be changed */}
        </div>
        <div className="flex items-center justify-between mt-2">
          <span>Fonksiyonel Çerezler</span>
          <Switch
            checked={cookiePreferences.functionalCookies}
            onCheckedChange={(checked: any) =>
              setCookiePreferences((prev) => ({
                ...prev,
                functionalCookies: checked,
              }))
            }
          />
        </div>
        <div className="flex items-center justify-between mt-2">
          <span>Pazarlama Çerezleri</span>
          <Switch
            checked={cookiePreferences.marketingCookies}
            onCheckedChange={(checked) =>
              setCookiePreferences((prev) => ({
                ...prev,
                marketingCookies: checked,
              }))
            }
          />
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <Button onClick={handleAcceptAll} className="w-full">
          Tüm Çerezleri Kabul Et
        </Button>
        <Button onClick={handleSavePreferences} className="w-full">
          Ayarları Kaydet
        </Button>
      </div>
      <div className="mt-4 text-center">
        <Link
          href="/yasal/gizlilik-politikasi"
          className="text-blue-500 underline"
        >
          Çerez Politikası
        </Link>
        'mızı buradan inceleyebilirsiniz.
      </div>
    </div>
  );
}
