import React, { useEffect, useState } from "react";
import { denemeService } from "@/app/services/denemeler.service";
import { derslerService } from "@/app/services/dersler.service";
import { toast } from "@/hooks/use-toast";
import {
  AnalizList,
  Ders,
  EsitAgirlikAnalizList,
  SayisalAnalizList,
  SozelAnalizList,
  TytAnalizList,
} from "@/types";
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Line,
  LineChart,
  CartesianGrid,
  Legend,
  TooltipProps,
} from "recharts";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { format } from "date-fns";
import { boolean } from "zod";
import { useTheme } from "next-themes";
import { useSignalR } from "@/hooks/use-signalr";
import authService from "@/app/services/auth.service";
import { HubUrls } from "@/types/hubUrls";
import { ReceiveFunctions } from "@/types/receiveFunctions";
import SpinnerMethodComponent from "@/app/spinner/spinnerForMethods";

const NetAnalizler = () => {
  const { theme } = useTheme();
  const isDarkTheme = theme === "dark";
  const [analiz, setAnaliz] = useState<
    | AnalizList[]
    | SayisalAnalizList[]
    | EsitAgirlikAnalizList[]
    | SozelAnalizList[]
    | TytAnalizList[]
  >([]);
  const [denemeSayisi, setDenemeSayisi] = useState<number>(5);
  const [dersAdi, setDersAdi] = useState<string | null>(null);
  const [dersler, setDersler] = useState<Ders[]>([]);
  const [isTyt, setIsTyt] = useState<boolean>(true);

  const [loading, setLoading] = useState<boolean>(false);
  const [alanTur, setAlanTur] = useState<string>("sayisal");
  const [selectedDersDisplay, setSelectedDersDisplay] =
    useState<string>("Genel");

  const fetchTyts = async () => {
    setLoading(true);
    try {
      const result = isTyt
        ? await denemeService.getTytNetAnaliz(denemeSayisi, dersAdi)
        : await denemeService.getAytNetAnaliz(denemeSayisi, alanTur, dersAdi);

      if (Array.isArray(result)) {
        setAnaliz(result);
      } else {
        throw new Error("Gelen veri bir dizi değil.");
      }
    } catch (error) {
      toast({
        title: "Hata",
        description: isTyt
          ? "TYT analizi alınırken bir hata oluştu."
          : "AYT analizi alınırken bir hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setDersAdi(null);
    const fetchData = async () => {
      await fetchDersler();
      await fetchTyts();
    };
    fetchData();
  }, [isTyt]);

  const handleIsTyt = async () => {
    setIsTyt(!isTyt);
    setDersAdi(null);
  };
  const handleAlanTurChange = (value: string) => {
    setAlanTur(value);
    setDersAdi(null); // Clear dersAdi when alanTur changes
  };
  useEffect(() => {
    setDersAdi(null);
    const fetchData = async () => {
      await fetchDersler();
      await fetchTyts();
    };
    fetchData();
  }, [alanTur]);

  useEffect(() => {
    fetchTyts();
  }, [dersAdi, denemeSayisi]);
  const signalRService = useSignalR();

  useEffect(() => {
    const userId = authService.userId as string;
    signalRService.start(HubUrls.TytHub, userId);
    signalRService.on(
      HubUrls.TytHub,
      ReceiveFunctions.TytAddedMessage,
      async (message) => {
        await fetchTyts();
      },
      userId
    );
    signalRService.on(
      HubUrls.TytHub,
      ReceiveFunctions.TytDeletedMessage,
      async (message) => {
        await fetchTyts();
      },
      userId
    );
    signalRService.on(
      HubUrls.TytHub,
      ReceiveFunctions.TytUpdatedMessage,
      async (message) => {
        await fetchTyts();
      },
      userId
    );

    signalRService.start(HubUrls.AytHub, userId);
    signalRService.on(
      HubUrls.AytHub,
      ReceiveFunctions.AytAddedMessage,
      async (message) => {
        await fetchTyts();
      },
      userId
    );
    signalRService.on(
      HubUrls.AytHub,
      ReceiveFunctions.AytDeletedMessage,
      async (message) => {
        await fetchTyts();
      },
      userId
    );
    signalRService.on(
      HubUrls.AytHub,
      ReceiveFunctions.AytUpdatedMessage,
      async (message) => {
        await fetchTyts();
      },
      userId
    );

    return () => {
      signalRService.off(
        HubUrls.TytHub,
        ReceiveFunctions.TytAddedMessage,
        userId
      );
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
  }, [signalRService, fetchTyts]);
  const fetchDersler = async () => {
    try {
      const response = await derslerService.getAllDers(isTyt);
      let filteredDersler = response.dersler;

      if (!isTyt) {
        switch (alanTur) {
          case "sayisal":
            filteredDersler = filteredDersler.filter((ders) =>
              ["Matematik", "Fizik", "Kimya", "Biyoloji"].includes(ders.dersAdi)
            );
            break;
          case "esitagirlik":
            filteredDersler = filteredDersler.filter((ders) =>
              ["Matematik", "Edebiyat", "Tarih1", "Coğrafya1"].includes(
                ders.dersAdi
              )
            );
            break;
          case "sozel":
            filteredDersler = filteredDersler.filter((ders) =>
              [
                "Edebiyat",
                "Tarih1",
                "Coğrafya1",
                "Tarih2",
                "Coğrafya2",
                "Felsefe",
                "Din",
              ].includes(ders.dersAdi)
            );
            break;
          case "dil":
            filteredDersler = [];
            break;
        }
      } else {
        const tytDersOrder = ["Türkçe", "Matematik", "Fen", "Sosyal"];
        filteredDersler = filteredDersler
          .filter((ders) => tytDersOrder.includes(ders.dersAdi))
          .sort(
            (a, b) =>
              tytDersOrder.indexOf(a.dersAdi) - tytDersOrder.indexOf(b.dersAdi)
          );
      }
      setDersAdi(null);
      setDersler(filteredDersler);
    } catch (error) {
      toast({
        title: "Hata",
        description: "Dersler alınırken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  

  const chartData = analiz.map((item) => {
    const formattedDate = item.tarih
      ? format(new Date(item.tarih), "dd/MM/yyyy")
      : "Geçersiz tarih";

    const baseData = {
      tarih: formattedDate,
      net: item.net,
    };

    function isSayisalAnaliz(item: any): item is SayisalAnalizList {
      return item.matematikNet !== undefined && item.fizikNet !== undefined;
    }

    function isEsitAgirlikAnaliz(item: any): item is EsitAgirlikAnalizList {
      return (
        item.edebiyatNet !== undefined &&
        item.tarih1Net !== undefined &&
        item.cografya1Net !== undefined
      );
    }

    function isSozelAnaliz(item: any): item is SozelAnalizList {
      return (
        item.edebiyatNet !== undefined &&
        item.tarih1Net !== undefined &&
        item.tarih2Net !== undefined &&
        item.cografya1Net !== undefined &&
        item.cografya2Net !== undefined &&
        item.felsefeNet !== undefined &&
        item.dinNet !== undefined
      );
    }

    function isTytAnaliz(item: any): item is TytAnalizList {
      return (
        item.matematikNet !== undefined &&
        item.turkceNet !== undefined &&
        item.fenNet !== undefined &&
        item.sosyalNet !== undefined
      );
    }

    function isAnaliz(item: any): item is AnalizList {
      return item.dogru !== undefined && item.yanlis !== undefined;
    }

    if (isSayisalAnaliz(item)) {
      return {
        ...baseData,
        matematikNet: item.matematikNet,
        fizikNet: item.fizikNet,
        kimyaNet: item.kimyaNet,
        biyolojiNet: item.biyolojiNet,
      };
    } else if (isAnaliz(item)) {
      return {
        ...baseData,
        dogru: item.dogru,
        yanlis: item.yanlis,
      };
    } else if (isSozelAnaliz(item)) {
      return {
        ...baseData,
        edebiyatNet: item.edebiyatNet,
        tarih1Net: item.tarih1Net,
        cografya1Net: item.cografya1Net,
        tarih2Net: item.tarih2Net,
        cografya2Net: item.cografya2Net,
        felsefeNet: item.felsefeNet,
        dinNet: item.dinNet,
      };
    } else if (isEsitAgirlikAnaliz(item)) {
      return {
        ...baseData,
        edebiyatNet: item.edebiyatNet,
        matematikNet: item.matematikNet,
        tarih1Net: item.tarih1Net,
        cografya1Net: item.cografya1Net,
      };
    } else if (isTytAnaliz(item)) {
      return {
        ...baseData,
        matematikNet: item.matematikNet,
        turkceNet: item.turkceNet,
        fenNet: item.fenNet,
        sosyalNet: item.sosyalNet,
      };
    } else {
      return baseData; // Fallback
    }
  });



  const CustomTooltip: React.FC<TooltipProps<number, string>> = ({
    active,
    payload,
  }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;

      return (
        <div className="custom-tooltip bg-gray-800 text-white p-2 rounded-md shadow-md w-48">
          <p>Net: {data.net}</p>
          {isTyt && !dersAdi ? (
            <>
              <p>
                Türkçe Net:{" "}
                {data.turkceNet !== undefined ? data.turkceNet : "0"}
              </p>
              <p>
                Matematik Net:{" "}
                {data.matematikNet !== undefined ? data.matematikNet : "0"}
              </p>
              <p>Fen Net: {data.fenNet !== undefined ? data.fenNet : "0"}</p>
              <p>
                Sosyal Net:{" "}
                {data.sosyalNet !== undefined ? data.sosyalNet : "0"}
              </p>
            </>
          ) : isTyt && dersAdi ? (
            <>
              <p>Doğru: {data.dogru !== undefined ? data.dogru : "0"}</p>
              <p>Yanlış: {data.yanlis !== undefined ? data.yanlis : "0"}</p>
            </>
          ) : !isTyt && alanTur === "sayisal" && dersAdi === null ? (
            <>
              <p>
                Matematik Net:{" "}
                {data.matematikNet !== undefined ? data.matematikNet : "0"}
              </p>
              <p>
                Fizik Net: {data.fizikNet !== undefined ? data.fizikNet : "0"}
              </p>
              <p>
                Kimya Net: {data.kimyaNet !== undefined ? data.kimyaNet : "0"}
              </p>
              <p>
                Biyoloji Net:{" "}
                {data.biyolojiNet !== undefined ? data.biyolojiNet : "0"}
              </p>
            </>
          ) : !isTyt && alanTur === "esitagirlik" && dersAdi === null ? (
            <>
              <p>
                Edebiyat Net:{" "}
                {data.edebiyatNet !== undefined ? data.edebiyatNet : "0"}
              </p>
              <p>
                Matematik Net:{" "}
                {data.matematikNet !== undefined ? data.matematikNet : "0"}
              </p>
              <p>
                Tarih1 Net:{" "}
                {data.tarih1Net !== undefined ? data.tarih1Net : "0"}
              </p>
              <p>
                Coğrafya1 Net:{" "}
                {data.cografya1Net !== undefined ? data.cografya1Net : "0"}
              </p>
            </>
          ) : !isTyt && alanTur === "sozel" && dersAdi === null ? (
            <>
              <p>
                Edebiyat Net:{" "}
                {data.edebiyatNet !== undefined ? data.edebiyatNet : "0"}
              </p>
              <p>
                Tarih1 Net:{" "}
                {data.tarih1Net !== undefined ? data.tarih1Net : "0"}
              </p>
              <p>
                Coğrafya1 Net:{" "}
                {data.cografya1Net !== undefined ? data.cografya1Net : "0"}
              </p>
              <p>
                Tarih2 Net:{" "}
                {data.tarih2Net !== undefined ? data.tarih2Net : "0"}
              </p>
              <p>
                Coğrafya2 Net:{" "}
                {data.cografya2Net !== undefined ? data.cografya2Net : "0"}
              </p>
              <p>
                Felsefe Net:{" "}
                {data.felsefeNet !== undefined ? data.felsefeNet : "0"}
              </p>
              <p>Din Net: {data.dinNet !== undefined ? data.dinNet : "0"}</p>
            </>
          ) : alanTur === "dil" || dersAdi ? (
            <>
              <p>Doğru: {data.dogru !== undefined ? data.dogru : "0"}</p>
              <p>Yanlış: {data.yanlis !== undefined ? data.yanlis : "0"}</p>
            </>
          ) : null}
        </div>
      );
    }
    return null;
  };






  return (
    <Card className="w-full max-w-md mt-4 mx-auto">
      <CardHeader>
        <CardTitle>{isTyt ? "TYT Net Analizi" : "AYT Net Analizi"}</CardTitle>
        <CardDescription>
          Son {analiz.length < denemeSayisi ? analiz.length : denemeSayisi}{" "}
          {isTyt ? "TYT denemesi için" : "AYT denemesi için"}{" "}
          {dersAdi === null &&
            !isTyt &&
            (alanTur === "sayisal"
              ? "Sayısal"
              : alanTur === "esitagirlik"
              ? "Eşit Ağırlık"
              : alanTur === "sozel"
              ? "Sözel"
              : alanTur === "dil"
              ? "Dil"
              : "")}{" "}
          {dersAdi !== null
            ? dersAdi === "turkce"
              ? "Türkçe"
              : dersAdi === "cografya1"
              ? "Coğrafya1"
              : dersAdi === "cografya2"
              ? "Coğrafya2"
              : dersAdi.charAt(0).toUpperCase() + dersAdi.slice(1)
            : "Genel"}{" "}
          net analizi
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <SpinnerMethodComponent />
        ) : analiz.length === 0 ? (
          <div className="text-center py-10">
            {isTyt ? "TYT" : "AYT"} denemeniz bulunmamaktadır.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <CartesianGrid
                stroke={isDarkTheme ? "#fff" : "#000"}
                opacity={0.3}
              />{" "}
              {/* Düz çizgi ve düşük opaklık */}
              <XAxis dataKey="tarih" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="linear" // Çizgiyi linear yapar
                dataKey="net"
                stroke="hsl(var(--chart-1))"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <h2 className="text-lg font-semibold">Deneme Türü</h2>
        <Select value={isTyt ? "TYT" : "AYT"} onValueChange={handleIsTyt}>
          <SelectTrigger className="h-8 w-full">
            <SelectValue placeholder={isTyt ? "TYT" : "AYT"} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="TYT">TYT</SelectItem>
            <SelectItem value="AYT">AYT</SelectItem>
          </SelectContent>
        </Select>

        {!isTyt && (
          <>
            <h2 className="text-lg font-semibold">Alan Türü</h2>
            <Select value={alanTur} onValueChange={handleAlanTurChange}>
              <SelectTrigger className="h-8 w-full">
                <SelectValue placeholder="Alan Türü Seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sayisal">Sayısal</SelectItem>
                <SelectItem value="esitagirlik">Eşit Ağırlık</SelectItem>
                <SelectItem value="sozel">Sözel</SelectItem>
                <SelectItem value="dil">Dil</SelectItem>
              </SelectContent>
            </Select>
          </>
        )}

        <h2 className="text-lg font-semibold">Dersler</h2>
        <Select
          value={dersAdi === null ? "Genel" : selectedDersDisplay}
          onValueChange={(value) => {
            if (value === "Genel") {
              setDersAdi(null);
              setSelectedDersDisplay("Genel");
            } else if (value === "Türkçe") {
              setDersAdi("turkce");
              setSelectedDersDisplay("Türkçe");
            } else if (value === "Coğrafya1") {
              setDersAdi("cografya1");
              setSelectedDersDisplay("Coğrafya1");
            } else if (value === "Coğrafya2") {
              setDersAdi("cografya2");
              setSelectedDersDisplay("Coğrafya2");
            } else {
              setDersAdi(value); // Keep the original value for other subjects
              setSelectedDersDisplay(value); // Display the selected value
            }
          }}
        >
          <SelectTrigger className="h-8 w-full">
            <SelectValue placeholder={selectedDersDisplay} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Genel">Genel</SelectItem>
            {dersler.map((ders) => (
              <SelectItem key={ders.id} value={ders.dersAdi}>
                {ders.dersAdi}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <h2 className="text-lg font-semibold">Deneme Sayısı</h2>
        <Select
          value={denemeSayisi.toString()}
          onValueChange={(value) => setDenemeSayisi(Number(value))}
        >
          <SelectTrigger className="h-8 w-full">
            <SelectValue placeholder="Deneme Sayısını Seçin" />
          </SelectTrigger>
          <SelectContent>
            {[5, 10, 15, 20, 30, 50].map((num) => (
              <SelectItem key={num} value={num.toString()}>
                {num}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardFooter>
    </Card>
  );
};

export default NetAnalizler;
