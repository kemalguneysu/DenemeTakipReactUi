import React, { useEffect, useState } from "react";
import { format } from "date-fns"; // date-fns kütüphanesini içe aktar
import { HomePageTyt } from "@/types"; // HomePageTyt sınıfını içe aktar
import { denemeService } from "@/app/services/denemeler.service";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../ui/accordion";
import { Icons } from "../icons";
import { Button } from "../ui/button";
import Link from "next/link";
import authService from "@/app/services/auth.service";
import { HubUrls } from "@/types/hubUrls";
import { ReceiveFunctions } from "@/types/receiveFunctions";
import { useSignalR } from "@/hooks/use-signalr";

const TYTCard = () => {
  const [homePageTyt, setHomePageTyt] = useState<HomePageTyt | undefined>(undefined);
  const signalRService = useSignalR();

  const fetchTyt = async () => {
    try {
      const result = await denemeService.getLastTyt();
      if (result === undefined) setHomePageTyt(undefined);
      const formattedResult = {
        ...result,
        CreatedDate: new Date(result.createdDate), // Dönüşüm burada yapılıyor
      };

      setHomePageTyt(formattedResult);
    } catch (error) {
    }
  };

  useEffect(() => {
    fetchTyt();
  }, []);

  useEffect(() => {
    const userId = authService.userId as string;
    signalRService.start(HubUrls.TytHub, userId);
    signalRService.on(
      HubUrls.TytHub,
      ReceiveFunctions.TytAddedMessage,
      async (message) => {
        await fetchTyt();
      },
      userId
    );
    signalRService.on(
      HubUrls.TytHub,
      ReceiveFunctions.TytDeletedMessage,
      async (message) => {
        await fetchTyt();
      },
      userId
    );
    signalRService.on(
      HubUrls.TytHub,
      ReceiveFunctions.TytUpdatedMessage,
      async (message) => {
        await fetchTyt();
      },
      userId
    );

    return () => {
      signalRService.off(
        HubUrls.TytHub,
        ReceiveFunctions.TytDeletedMessage,
        userId
      );
      signalRService.off(
        HubUrls.TytHub,
        ReceiveFunctions.TytAddedMessage,
        userId
      );
      signalRService.off(
        HubUrls.TytHub,
        ReceiveFunctions.TytUpdatedMessage,
        userId
      );
    };
  }, [signalRService, fetchTyt]);

  const createdDate = homePageTyt ? homePageTyt.CreatedDate : null;
  const formattedDate =
    createdDate && !isNaN(createdDate.getTime())
      ? format(createdDate, "dd/MM/yyyy")
      : "Geçersiz tarih";

  // Net hesaplama fonksiyonu
  const calculateNet = (dogru: number, yanlis: number) => {
    return dogru - 0.25 * yanlis; // Net hesaplama formülü
  };

  // Değerleri formatlamak için yardımcı fonksiyon
  const formatValue = (value: number) => {
    return value % 1 === 0 ? value.toString() : value.toFixed(2);
  };

  return (
    <div className="mx-auto p-4 border rounded-lg shadow-lg mt-4">
      {homePageTyt ? (
        <>
          <h2 className="text-lg font-bold">Son TYT Denemesi</h2>
          <p className="text-gray-500">{formattedDate}</p>

          {/* Accordion bileşeni kullanımı */}
          <Accordion type="single" collapsible className="mt-4">
            {/* Türkçe Net Accordion */}
            <AccordionItem value="turkce-net">
              <AccordionTrigger>
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold cursor-pointer">
                    Türkçe Net: {formatValue(calculateNet(homePageTyt.turkceDogru, homePageTyt.turkceYanlis))}
                  </h3>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <p>Türkçe Doğru: {homePageTyt.turkceDogru}</p>
                <p>Türkçe Yanlış: {homePageTyt.turkceYanlis}</p>
              </AccordionContent>
            </AccordionItem>

            {/* Matematik Net Accordion */}
            <AccordionItem value="matematik-net">
              <AccordionTrigger>
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold cursor-pointer">
                    Matematik Net: {formatValue(calculateNet(homePageTyt.matematikDogru, homePageTyt.matematikYanlis))}
                  </h3>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <p>Matematik Doğru: {homePageTyt.matematikDogru}</p>
                <p>Matematik Yanlış: {homePageTyt.matematikYanlis}</p>
              </AccordionContent>
            </AccordionItem>

            {/* Fen Net Accordion */}
            <AccordionItem value="fen-net">
              <AccordionTrigger>
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold cursor-pointer">
                    Fen Net: {formatValue(calculateNet(homePageTyt.fenDogru, homePageTyt.fenYanlis))}
                  </h3>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <p>Fen Doğru: {homePageTyt.fenDogru}</p>
                <p>Fen Yanlış: {homePageTyt.fenYanlis}</p>
              </AccordionContent>
            </AccordionItem>

            {/* Sosyal Net Accordion */}
            <AccordionItem value="sosyal-net">
              <AccordionTrigger>
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold cursor-pointer">
                    Sosyal Net: {formatValue(calculateNet(homePageTyt.sosyalDogru, homePageTyt.sosyalYanlis))}
                  </h3>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <p>Sosyal Doğru: {homePageTyt.sosyalDogru}</p>
                <p>Sosyal Yanlış: {homePageTyt.sosyalYanlis}</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="mt-4">
            <p className="font-semibold">Toplam Net: {homePageTyt.toplamNet}</p>
          </div>

          <Link
            href={`/denemelerim/tyt/${homePageTyt.id}`}
            className="cursor-pointer flex justify-end"
          >
            <Button className="mt-2">Detayları Gör</Button>
          </Link>
        </>
      ) : (
        <div>
          <p>TYT denemeniz bulunmamaktadır.</p>
          <Link href="/denemelerim" className="flex justify-end mt-2">
            <Button>TYT Denemesi Ekle</Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default TYTCard;
