import React, { useEffect, useState } from "react";
import { AnalizList, DenemeAnaliz, Ders } from "@/types"; // Gerekli türleri içe aktar
import { denemeService } from "@/app/services/denemeler.service";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import { Card, CardContent } from "../ui/card";
import { derslerService } from "@/app/services/dersler.service";

const TYTCarousel = () => {
  const [dersler, setDersler] = useState<Ders[]>([]);
  const [konular, setKonular] = useState<DenemeAnaliz[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0); // Seçili öğenin indeksi

  // Dersleri çekme
  const fetchDersler = async () => {
    try {
      const result = await derslerService.getAllDers(true);

      // Dersleri isme göre sıralamak için bir sıralama fonksiyonu tanımlıyoruz
      const sortedDersler = result.dersler.sort((a, b) => {
        const order = ["Türkçe", "Matematik", "Fen", "Sosyal"]; // Sıralama önceliği
        return order.indexOf(a.dersAdi) - order.indexOf(b.dersAdi);
      });

      setDersler(sortedDersler);

      if (sortedDersler.length > 0) {
        fetchKonular(sortedDersler[0].id); // İlk dersin konularını çek
      }
    } catch (error) {
      console.error("Error fetching dersler:", error);
    }
  };


  const fetchKonular = async (dersId: string) => {
    try {
      const result = await denemeService.getTytAnaliz(5, 3, dersId, "yanlis");
      setKonular(result);
    } catch (error) {
      console.error("Error fetching konular:", error);
    }
  };

  useEffect(() => {
    fetchDersler();
  }, []);

  useEffect(() => {
    if (dersler.length > 0) {
      fetchKonular(dersler[selectedIndex].id); // Seçilen dersin ID'sini kullan
    }
  }, [selectedIndex, dersler]);

  const handlePrevious = () => {
    setSelectedIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => Math.min(prev + 1, dersler.length - 1));
  };

  return (
    <div className="relative w-full">
      <Carousel orientation="vertical" className="w-full mx-4">
        <CarouselContent className="">
          {" "}
          {/* Dikey görünüm için height ayarı */}
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
                      {/* Yuvarlak işaretler için list-disc ve list-inside eklenmiştir */}
                      {konular.length > 0 &&
                      konular.some(
                        (konu) => konu.dersId === dersler[selectedIndex].id
                      ) ? (
                        konular
                          .filter(
                            (konu) => konu.dersId === dersler[selectedIndex].id
                          ) // Seçilen dersin konularını göster
                          .map((konu) => (
                            <li key={konu.konuId} className="ml-2 font-light">
                              {/* ml-2 ile soldan boşluk artırılmıştır */}
                              {konu.konuAdi} - {konu.sayi} adet
                            </li>
                          ))
                      ) : (
                        <p className="text-center font-normal">
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
        <div className="flex justify-between items-center h-full px-2">
          {/* Butonların dikey marjını kaldırmak için "items-center" sınıfını kaldırdım */}
          <CarouselPrevious
            className="mx-1"
            onClick={handlePrevious}
            disabled={selectedIndex === 0}
          />
          <CarouselNext
            className="mx-1"
            onClick={handleNext}
            disabled={selectedIndex === dersler.length - 1}
          />
        </div>
      </Carousel>
    </div>
  );
};

export default TYTCarousel;
