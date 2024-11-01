import Link from "next/link";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogOverlay, DialogTitle } from "./ui/dialog";
import { Switch } from "./ui/switch";

const CookieConsentBanner = () => {
  const { theme } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [isPersonalizeOpen, setIsPersonalizeOpen] = useState(false);
  const [functionalCookiesEnabled, setFunctionalCookiesEnabled] =
    useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem("cookieConsent", "false");
    setIsVisible(false);
  };

  const handlePersonalize = () => {
    setIsPersonalizeOpen(true);
  };

  const handleDeclineOptional = () => {
    console.log("Zorunlu olmayan çerezler reddedildi");
    setIsVisible(false);
  };

  const handleSavePreferences = () => {
    const preferences = {
      functionalCookies: functionalCookiesEnabled,
    };
    localStorage.setItem("cookieConsent", JSON.stringify(preferences));
    setIsVisible(false);
    setIsPersonalizeOpen(false);
  };

  return (
    <>
      {isVisible && (
        <div
          className={`fixed bottom-0 left-0 right-0 p-4 mx-auto border-t-2 ${
            theme === "dark" ? "border-gray-600" : "border-gray-300"
          } bg-background`}
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
              <span>Fonksiyonel Çerezler</span>
              <Switch
                checked={functionalCookiesEnabled}
                onCheckedChange={setFunctionalCookiesEnabled}
              />
            </div>
          </div>
          <div className="mt-4 flex justify-between w-full">
            <Button onClick={handleAcceptAll} className="ml-4">
              Tüm Çerezleri Kabul Et
            </Button>
            <Button onClick={handleSavePreferences} className="ml-4">
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
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CookieConsentBanner;
