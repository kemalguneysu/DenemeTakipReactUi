import Link from "next/link";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogOverlay, DialogTitle } from "./ui/dialog";
import { Switch } from "./ui/switch";
import SpinnerMethodComponent from "@/app/spinner/spinnerForMethods";

const CookieConsentBanner = () => {
  const { theme } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [isPersonalizeOpen, setIsPersonalizeOpen] = useState(false);
  const [functionalCookiesEnabled, setFunctionalCookiesEnabled] =useState(false);
  const [commercialCookiesEnabled, setCommercialCookiesEnabled] = useState(false);
  const [loading, setLoading] = useState(false); 

  const [cookiePreferences, setCookiePreferences] = useState({
    essentialCookies: true, // Assuming essential cookies are always enabled
    functionalCookies: false,
    commercialCookies: false,
  });
  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAcceptAll = () => {
    setLoading(true);
    const preferences = {
      essentialCookies: true,
      functionalCookies: true,
      commercialCookies: true,
    };
    localStorage.setItem("cookieConsent", JSON.stringify(preferences));
    setCookiePreferences(preferences);
    setIsVisible(false);
    setIsPersonalizeOpen(false);
    setLoading(false);

  };

  const handlePersonalize = () => {
    setIsPersonalizeOpen(true);
  };

  const handleDeclineOptional = () => {
    setIsVisible(false);
  };

  const handleSavePreferences = () => {
    setLoading(true);
    const preferences = {
      essentialCookies: true,
      functionalCookies: functionalCookiesEnabled,
      commercialCookies: commercialCookiesEnabled,
    };
    localStorage.setItem("cookieConsent", JSON.stringify(preferences));
    setIsVisible(false);
    setIsPersonalizeOpen(false);
    setLoading(false);

  };

  return (
    <>
      {loading && <SpinnerMethodComponent />}

      {isVisible && (
        <div
          className={`fixed bottom-0 left-0 right-0 p-4 mx-auto border-t-2 ${
            theme === "dark" ? "border-gray-600" : "border-gray-300"
          } bg-background`} // Ensure the background is fully opaque
        >
          <span>
            Bu web sitesi bazı çerezleri kullanmaktadır. Bu çerezlerden bazıları
            web sitenizin düzgün çalışabilmesi için gereklidir ve bunları
            reddetme seçeneğiniz yoktur. Daha fazla bilgi için{" "}
            <Link
              href="/yasal/gizlilik-politikasi"
              className="text-blue-600 underline"
            >
              Gizlilik Politikası'nı
            </Link>{" "}
            ve{" "}
            <Link
              href="/yasal/kullanim-sartlari"
              className="text-blue-600 underline"
            >
              Kullanım Şartları'nı
            </Link>{" "}
            okuyabilirsiniz.
          </span>
          <div className="flex space-x-4 mt-2">
            <Button onClick={handleAcceptAll} className="ml-4">
              Tümünü Kabul Et
            </Button>
            <Button onClick={handlePersonalize} className="ml-4">
              Kişiselleştir
            </Button>
            <Button onClick={handleDeclineOptional} className="ml-4">
              Zorunlu Olmayanları Reddet
            </Button>
          </div>
        </div>
      )}

      <Dialog open={isPersonalizeOpen} onOpenChange={setIsPersonalizeOpen}>
        <DialogOverlay className="fixed inset-0 bg-black opacity-30" />
        <DialogContent className="flex flex-col items-center justify-center rounded p-6 mx-auto my-auto max-w-sm w-full">
          <DialogTitle className="text-lg font-bold">
            Çerez Ayarları
          </DialogTitle>
          <div className="mt-4">
            <div className="flex items-center justify-between">
              <span>Zorunlu Çerezler</span>
              <Switch checked disabled />
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="mr-2">Fonksiyonel Çerezler</span>
              <Switch
                checked={functionalCookiesEnabled}
                onCheckedChange={setFunctionalCookiesEnabled}
              />
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="mr-2">Pazarlama Çerezler</span>
              <Switch
                checked={commercialCookiesEnabled}
                onCheckedChange={setCommercialCookiesEnabled}
              />
            </div>
          </div>
          <div className="mt-4 space-y-2">
            {/* Buttons stacked vertically */}
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
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CookieConsentBanner;
