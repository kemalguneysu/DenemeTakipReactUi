import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { HomePageAyt } from "@/types";
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
import { useSignalR } from "@/hooks/use-signalr";
import authService from "@/app/services/auth.service";
import { HubUrls } from "@/types/hubUrls";
import { ReceiveFunctions } from "@/types/receiveFunctions";

const AYTCard = () => {
  const [homePageAyt, setHomePageAyt] = useState<HomePageAyt | undefined>(
    undefined
  );
  const signalRService = useSignalR();

  const fetchAyt = async () => {
    try {
      const result = await denemeService.getLastAyt();
      if(result===undefined)
        setHomePageAyt(undefined);
      const formattedResult = {
        ...result,
        CreatedDate: new Date(result.createdDate),
      };
      setHomePageAyt(formattedResult);
    } catch (error) {
      console.error("AYT denemesi alınamadı.", error);
    }
  };

  useEffect(() => {
    fetchAyt();
  }, []);
  
  useEffect(() => {
    const userId = authService.userId as string;
    signalRService.start(HubUrls.AytHub, userId);
    signalRService.on(
      HubUrls.AytHub,
      ReceiveFunctions.AytAddedMessage,
      async (message) => {
        await fetchAyt();
      },
      userId
    );
    signalRService.on(
      HubUrls.AytHub,
      ReceiveFunctions.AytDeletedMessage,
      async (message) => {
        await fetchAyt();
      },
      userId
    );
    signalRService.on(
      HubUrls.AytHub,
      ReceiveFunctions.AytUpdatedMessage,
      async (message) => {
        await fetchAyt();
      },
      userId
    );

    return () => {
      signalRService.off(
        HubUrls.AytHub,
        ReceiveFunctions.AytDeletedMessage,
        userId
      );
      signalRService.off(
        HubUrls.AytHub,
        ReceiveFunctions.AytAddedMessage,
        userId
      );
      signalRService.off(
        HubUrls.AytHub,
        ReceiveFunctions.AytUpdatedMessage,
        userId
      );
    };
  }, [signalRService, fetchAyt]);

  const createdDate = homePageAyt ? homePageAyt.CreatedDate : null;
  const formattedDate =
    createdDate && !isNaN(createdDate.getTime())
      ? format(createdDate, "dd/MM/yyyy")
      : "Geçersiz tarih";

  // Net hesaplama fonksiyonu
  const calculateNet = (dogru: number, yanlis: number) => {
    return dogru - 0.25 * yanlis; // Net hesaplama formülü
  };

  // Sayısal Net hesaplama
  const calculateSayisalNet = (): number => {
    return (
      calculateNet(
        homePageAyt?.matematikDogru || 0,
        homePageAyt?.matematikYanlis || 0
      ) +
      calculateNet(
        homePageAyt?.fizikDogru || 0,
        homePageAyt?.fizikYanlis || 0
      ) +
      calculateNet(
        homePageAyt?.kimyaDogru || 0,
        homePageAyt?.kimyaYanlis || 0
      ) +
      calculateNet(
        homePageAyt?.biyolojiDogru || 0,
        homePageAyt?.biyolojiYanlis || 0
      )
    );
  };
  const calculateEsitAgirlikNet = (): number => {
    return (
      calculateNet(
        homePageAyt?.edebiyatDogru || 0,
        homePageAyt?.edebiyatYanlis || 0
      ) +
      calculateNet(
        homePageAyt?.matematikDogru || 0,
        homePageAyt?.matematikYanlis || 0
      ) +
      calculateNet(
        homePageAyt?.tarih1Dogru || 0,
        homePageAyt?.tarih1Yanlis || 0
      ) +
      calculateNet(
        homePageAyt?.cografya1Dogru || 0,
        homePageAyt?.cografya1Yanlis || 0
      )
    );
  };

  const calculateSozelNet = (): number => {
    return (
      calculateNet(
        homePageAyt?.edebiyatDogru || 0,
        homePageAyt?.edebiyatYanlis || 0
      ) +
      calculateNet(
        homePageAyt?.tarih1Dogru || 0,
        homePageAyt?.tarih1Yanlis || 0
      ) +
      calculateNet(
        homePageAyt?.cografya1Dogru || 0,
        homePageAyt?.cografya1Yanlis || 0
      ) +
      calculateNet(
        homePageAyt?.tarih2Dogru || 0,
        homePageAyt?.tarih2Yanlis || 0
      ) +
      calculateNet(
        homePageAyt?.cografya2Dogru || 0,
        homePageAyt?.cografya2Yanlis || 0
      ) +
      calculateNet(
        homePageAyt?.felsefeDogru || 0,
        homePageAyt?.felsefeYanlis || 0
      ) +
      calculateNet(homePageAyt?.dinDogru || 0, homePageAyt?.dinYanlis || 0)
    );
  };
  const formatValue = (value: number) => {
    return value % 1 === 0 ? value.toString() : value.toFixed(2);
  };

  return (
    <div className="mx-auto p-4 border rounded-lg shadow-lg mt-4">
      {homePageAyt ? (
        <>
          <h2 className="text-lg font-bold">Son AYT Denemesi</h2>
          <p className="text-gray-500">{formattedDate}</p>

          {/* Accordion bileşeni kullanımı */}
          <Accordion type="multiple" className="mt-4">
            {/* Sayısal Net Accordion */}
            <AccordionItem value="sayisal-net" id="sayisal">
              <AccordionTrigger>
                <div className="flex items-center justify-between">
                  <h3 className="font-bold cursor-pointer">
                    Sayısal Net: {formatValue(calculateSayisalNet())}
                  </h3>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <AccordionItem value="matematik-net">
                  <AccordionTrigger id="matematik">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold cursor-pointer">
                        Matematik Net:{" "}
                        {calculateNet(
                          homePageAyt.matematikDogru,
                          homePageAyt.matematikYanlis
                        )}
                      </h3>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="font-thin">
                      Matematik Doğru: {homePageAyt.matematikDogru}
                    </p>
                    <p className="font-thin">
                      Matematik Yanlış: {homePageAyt.matematikYanlis}
                    </p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="fizik-net">
                  <AccordionTrigger id="fizik">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold cursor-pointer">
                        Fizik Net:{" "}
                        {calculateNet(
                          homePageAyt.fizikDogru,
                          homePageAyt.fizikYanlis
                        )}
                      </h3>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="font-thin">
                      Fizik Doğru: {homePageAyt.fizikDogru}
                    </p>
                    <p className="font-thin">
                      Fizik Yanlış: {homePageAyt.fizikYanlis}
                    </p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="kimya-net">
                  <AccordionTrigger id="kimya">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold cursor-pointer">
                        Kimya Net:{" "}
                        {calculateNet(
                          homePageAyt.kimyaDogru,
                          homePageAyt.kimyaYanlis
                        )}
                      </h3>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="font-thin">
                      Kimya Doğru: {homePageAyt.kimyaDogru}
                    </p>
                    <p className="font-thin">
                      Kimya Yanlış: {homePageAyt.kimyaYanlis}
                    </p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="biyoloji-net">
                  <AccordionTrigger id="biyoloji">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold cursor-pointer">
                        Biyoloji Net:{" "}
                        {calculateNet(
                          homePageAyt.biyolojiDogru,
                          homePageAyt.biyolojiYanlis
                        )}
                      </h3>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="font-thin">
                      Biyoloji Doğru: {homePageAyt.biyolojiDogru}
                    </p>
                    <p className="font-thin">
                      Biyoloji Yanlış: {homePageAyt.biyolojiYanlis}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="esitAgirlik-net" id="esitAgirlik">
              <AccordionTrigger>
                <div className="flex items-center justify-between">
                  <h3 className="font-bold cursor-pointer">
                    Eşit Ağırlık Net: {formatValue(calculateEsitAgirlikNet())}
                  </h3>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <AccordionItem value="edebiyat-net">
                  <AccordionTrigger id="edebiyat">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold cursor-pointer">
                        Edebiyat Net:{" "}
                        {calculateNet(
                          homePageAyt.edebiyatDogru,
                          homePageAyt.edebiyatYanlis
                        )}
                      </h3>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="font-thin">
                      Edebiyat Doğru: {homePageAyt.edebiyatDogru}
                    </p>
                    <p className="font-thin">
                      Edebiyat Yanlış: {homePageAyt.edebiyatYanlis}
                    </p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="matematik-net">
                  <AccordionTrigger id="matematik">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold cursor-pointer">
                        Matematik Net:{" "}
                        {calculateNet(
                          homePageAyt.matematikDogru,
                          homePageAyt.matematikYanlis
                        )}
                      </h3>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="font-thin">
                      Matematik Doğru: {homePageAyt.matematikDogru}
                    </p>
                    <p className="font-thin">
                      Matematik Yanlış: {homePageAyt.matematikYanlis}
                    </p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="tarih1-net">
                  <AccordionTrigger id="tarih1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold cursor-pointer">
                        Tarih1 Net:{" "}
                        {calculateNet(
                          homePageAyt.tarih1Dogru,
                          homePageAyt.tarih1Yanlis
                        )}
                      </h3>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="font-thin">
                      Tarih1 Doğru: {homePageAyt.tarih1Dogru}
                    </p>
                    <p className="font-thin">
                      Tarih1 Yanlış: {homePageAyt.tarih1Yanlis}
                    </p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="cografya1-net">
                  <AccordionTrigger id="cografya1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold cursor-pointer">
                        Coğrafya1 Net:{" "}
                        {calculateNet(
                          homePageAyt.cografya1Dogru,
                          homePageAyt.cografya1Yanlis
                        )}
                      </h3>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="font-thin">
                      Coğrafya1 Doğru: {homePageAyt.cografya1Dogru}
                    </p>
                    <p className="font-thin">
                      Coğrafya1 Yanlış: {homePageAyt.cografya1Yanlis}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="sozel-net" id="sozel">
              <AccordionTrigger>
                <div className="flex items-center justify-between">
                  <h3 className="font-bold cursor-pointer">
                    Sözel Net: {formatValue(calculateSozelNet())}
                  </h3>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <AccordionItem value="edebiyat-net">
                  <AccordionTrigger id="edebiyat">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold cursor-pointer">
                        Edebiyat Net:{" "}
                        {calculateNet(
                          homePageAyt.edebiyatDogru,
                          homePageAyt.edebiyatYanlis
                        )}
                      </h3>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="font-thin">
                      Edebiyat Doğru: {homePageAyt.edebiyatDogru}
                    </p>
                    <p className="font-thin">
                      Edebiyat Yanlış: {homePageAyt.edebiyatYanlis}
                    </p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="tarih1-net">
                  <AccordionTrigger id="tarih1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold cursor-pointer">
                        Tarih1 Net:{" "}
                        {calculateNet(
                          homePageAyt.tarih1Dogru,
                          homePageAyt.tarih1Yanlis
                        )}
                      </h3>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="font-thin">
                      Tarih1 Doğru: {homePageAyt.tarih1Dogru}
                    </p>
                    <p className="font-thin">
                      Tarih1 Yanlış: {homePageAyt.tarih1Yanlis}
                    </p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="cografya1-net">
                  <AccordionTrigger id="cografya1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold cursor-pointer">
                        Coğrafya1 Net:{" "}
                        {calculateNet(
                          homePageAyt.cografya1Dogru,
                          homePageAyt.cografya1Yanlis
                        )}
                      </h3>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="font-thin">
                      Coğrafya1 Doğru: {homePageAyt.cografya1Dogru}
                    </p>
                    <p className="font-thin">
                      Coğrafya1 Yanlış: {homePageAyt.cografya1Yanlis}
                    </p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="tarih2-net">
                  <AccordionTrigger id="tarih2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold cursor-pointer">
                        Tarih2 Net:{" "}
                        {calculateNet(
                          homePageAyt.tarih2Dogru,
                          homePageAyt.tarih2Yanlis
                        )}
                      </h3>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="font-thin">
                      Tarih2 Doğru: {homePageAyt.tarih2Dogru}
                    </p>
                    <p className="font-thin">
                      Tarih2 Yanlış: {homePageAyt.tarih2Yanlis}
                    </p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="cografya2-net">
                  <AccordionTrigger id="cografya2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold cursor-pointer">
                        Coğrafya2 Net:{" "}
                        {calculateNet(
                          homePageAyt.cografya2Dogru,
                          homePageAyt.cografya2Yanlis
                        )}
                      </h3>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="font-thin">
                      Coğrafya2 Doğru: {homePageAyt.cografya2Dogru}
                    </p>
                    <p className="font-thin">
                      Coğrafya2 Yanlış: {homePageAyt.cografya2Yanlis}
                    </p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="felsefe-net">
                  <AccordionTrigger id="felsefe">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold cursor-pointer">
                        Felsefe Net:{" "}
                        {calculateNet(
                          homePageAyt.felsefeDogru,
                          homePageAyt.felsefeYanlis
                        )}
                      </h3>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="font-thin">
                      Felsefe Doğru: {homePageAyt.felsefeDogru}
                    </p>
                    <p className="font-thin">
                      Felsefe Yanlış: {homePageAyt.felsefeYanlis}
                    </p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="din-net">
                  <AccordionTrigger id="din">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold cursor-pointer">
                        Din Net:{" "}
                        {calculateNet(
                          homePageAyt.dinDogru,
                          homePageAyt.dinYanlis
                        )}
                      </h3>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="font-thin">
                      Din Doğru: {homePageAyt.dinDogru}
                    </p>
                    <p className="font-thin">
                      Din Yanlış: {homePageAyt.dinYanlis}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="dil-net" id="dil">
              <AccordionTrigger>
                <div className="flex items-center justify-between">
                  <h3 className="font-bold cursor-pointer">
                    Dil Net:{" "}
                    {calculateNet(homePageAyt.dilDogru, homePageAyt.dilYanlis)}
                  </h3>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <p className="font-thin">Dil Doğru: {homePageAyt.dilDogru}</p>
                <p className="font-thin">Dil Yanlış: {homePageAyt.dilYanlis}</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Link
            href={`/denemelerim/ayt/${homePageAyt.id}`}
            className="cursor-pointer flex justify-end"
          >
            <Button className="mt-2">Detayları Gör</Button>
          </Link>
        </>
      ) : (
        <div>
          <p>AYT denemeniz bulunmamaktadır.</p>
          <Link href="/denemelerim" className="flex justify-end mt-2">
            <Button>AYT Denemesi Ekle</Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default AYTCard;
