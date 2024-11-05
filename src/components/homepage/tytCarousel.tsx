import React, { useEffect, useState } from "react";
import { AnalizList, DenemeAnaliz, Ders } from "@/types";
import { denemeService } from "@/app/services/denemeler.service";
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";
import { Card, CardContent } from "../ui/card";
import { derslerService } from "@/app/services/dersler.service";
import { useTheme } from "next-themes"; // Assuming you're using next-themes for theme management
import { Icons } from "../icons";
import SpinnerMethodComponent from "@/app/spinner/spinnerForMethods";

const TYTCarousel = () => {
  const [dersler, setDersler] = useState<Ders[]>([]);
  const [konular, setKonular] = useState<DenemeAnaliz[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [orientation, setOrientation] = useState<"vertical" | "horizontal">(
    "vertical"
  ); // Orientation state
  const [loading, setLoading] = useState(false); 

  const { theme } = useTheme(); // Get the current theme

  // Dersleri çekme
  const fetchDersler = async () => {
    setLoading(true);

    try {
      const result = await derslerService.getAllDers(true);
      const sortedDersler = result.dersler.sort((a, b) => {
        const order = ["Türkçe", "Matematik", "Fen", "Sosyal"];
        return order.indexOf(a.dersAdi) - order.indexOf(b.dersAdi);
      });

      setDersler(sortedDersler);

      if (sortedDersler.length > 0) {
        fetchKonular(sortedDersler[0].id);
      }
    } catch (error) {
    }
    setLoading(false);
  };

  const fetchKonular = async (dersId: string) => {
    setLoading(true);

    try {
      const result = await denemeService.getTytAnaliz(5, 3, dersId, "yanlis");
      setKonular(result);
    } catch (error) {
      console.error("Konuları çekerken hata oluştu:", error);
    }
    setLoading(false);

  };

  useEffect(() => {
    fetchDersler();
  }, []);

  useEffect(() => {
    if (dersler.length > 0) {
      fetchKonular(dersler[selectedIndex].id);
    }
  }, [selectedIndex, dersler]);

  // Ekran boyutuna göre orientation'ı ayarla
  useEffect(() => {
    const updateOrientation = () => {
      setOrientation(window.innerWidth < 768 ? "horizontal" : "vertical");
    };

    updateOrientation(); // İlk render'da doğru orientation'u ayarla
    window.addEventListener("resize", updateOrientation);
    return () => window.removeEventListener("resize", updateOrientation);
  }, []);

  const handlePrevious = () => {
    setSelectedIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => Math.min(prev + 1, dersler.length - 1));
  };

  // Butonlar için opaklık değerlerini ayarlama
  const previousButtonOpacity =
    selectedIndex === 0 ? "opacity-50" : "opacity-100";
  const nextButtonOpacity =
    selectedIndex === dersler.length - 1 ? "opacity-50" : "opacity-100";

  return (
    <div className="relative w-full">
      {loading && <SpinnerMethodComponent />}

      {/* Yukarı ok butonu */}
      <div className="hidden md:flex justify-center items-center mb-2">
        <button
          className={`flex items-center justify-center w-6 h-6 rounded-full ${
            theme === "dark"
              ? `bg-black border border-white hover:bg-gray-800 ${previousButtonOpacity}`
              : `bg-white border border-black hover:bg-gray-200 ${previousButtonOpacity}`
          } ${
            selectedIndex === 0 ? "opacity-50 cursor-not-allowed" : ""
          } border-[1px]`}
          onClick={handlePrevious}
          disabled={selectedIndex === 0}
          aria-label="Önceki"
        >
          <span className="material-icons text-xs">
            <Icons.arrowUp className="max-w-15 p-1 opacity-80" />
          </span>
        </button>
      </div>

      <Carousel
        orientation={orientation}
        className="w-full"
        opts={{
          dragFree: true,
          dragThreshold: 10,
          watchDrag: true,
        }}
      >
        <CarouselContent>
          {dersler.length > 0 && (
            <CarouselItem>
              <div className="p-1">
                <Card>
                  <CardContent className="flex flex-col p-6">
                    <h4 className="text-sm font-light mb-1 text-left">
                      Son 5 TYT denemesi {dersler[selectedIndex].dersAdi} dersi
                      için
                    </h4>
                    <h3 className="text-md font-semibold mb-2 text-center break-words">
                      En Fazla Yanlış Yapılan Konular
                    </h3>
                    <ul className="w-full list-disc list-inside">
                      {Array.isArray(konular) &&
                      konular.length > 0 &&
                      konular.some(
                        (konu) => konu.dersId === dersler[selectedIndex].id
                      ) ? (
                        konular
                          .filter(
                            (konu) => konu.dersId === dersler[selectedIndex].id
                          )
                          .map((konu) => (
                            <li key={konu.konuId} className="ml-2 font-light">
                              {konu.konuAdi} - {konu.sayi} adet
                            </li>
                          ))
                      ) : (
                        <p className="text-center font-light">
                          {dersler[selectedIndex].dersAdi} dersinde yanlış
                          yaptığınız konu bulunmamaktadır.
                        </p>
                      )}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          )}
        </CarouselContent>
      </Carousel>

      {/* Aşağı ok butonu */}
      <div className="hidden md:flex justify-center items-center mt-2">
        <button
          className={`flex items-center justify-center w-6 h-6 rounded-full ${
            theme === "dark"
              ? `bg-black border border-white hover:bg-gray-800 ${nextButtonOpacity}`
              : `bg-white border border-black hover:bg-gray-200 ${nextButtonOpacity}`
          } ${
            selectedIndex === dersler.length - 1
              ? "opacity-50 cursor-not-allowed"
              : ""
          } border-[1px]`}
          onClick={handleNext}
          disabled={selectedIndex === dersler.length - 1}
          aria-label="Sonraki"
        >
          <span className="material-icons text-xs">
            <Icons.arrowDown className="max-w-15 p-1 opacity-80" />
          </span>
        </button>
      </div>

      {/* Mobil ok butonları */}
      <div className="md:hidden flex justify-center items-center mt-2">
        <button
          className={`flex items-center justify-center w-6 h-6 rounded-full ${
            theme === "dark"
              ? `bg-black border border-white hover:bg-gray-800 ${previousButtonOpacity}`
              : `bg-white border border-black hover:bg-gray-200 ${previousButtonOpacity}`
          } ${
            selectedIndex === 0 ? "opacity-50 cursor-not-allowed" : ""
          } border-[1px] mr-2`}
          onClick={handlePrevious}
          disabled={selectedIndex === 0}
          aria-label="Önceki"
        >
          <span className="material-icons text-xs">
            <Icons.arrowLeft className="max-w-15 p-1 opacity-80" />
          </span>
        </button>
        <button
          className={`flex items-center justify-center w-6 h-6 rounded-full ${
            theme === "dark"
              ? `bg-black border border-white hover:bg-gray-800 ${nextButtonOpacity}`
              : `bg-white border border-black hover:bg-gray-200 ${nextButtonOpacity}`
          } ${
            selectedIndex === dersler.length - 1
              ? "opacity-50 cursor-not-allowed"
              : ""
          } border-[1px]`}
          onClick={handleNext}
          disabled={selectedIndex === dersler.length - 1}
          aria-label="Sonraki"
        >
          <span className="material-icons text-xs">
            <Icons.arrowRight className="max-w-15 p-1 opacity-80" />
          </span>
        </button>
      </div>
    </div>
  );
};

export default TYTCarousel;
