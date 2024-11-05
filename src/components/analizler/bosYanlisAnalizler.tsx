"use client";

import { denemeService } from "@/app/services/denemeler.service";
import { derslerService } from "@/app/services/dersler.service";
import { toast } from "@/hooks/use-toast";
import { DenemeAnaliz, Ders } from "@/types";
import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  BarChart,
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
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { TrendingUp } from "lucide-react";
import SpinnerMethodComponent from "@/app/spinner/spinnerForMethods";

export const description = "Bar chart for analyzing exam results";

const BosYanlisAnalizler = () => {
  const [analiz, setAnaliz] = useState<DenemeAnaliz[]>([]);
  const [denemeSayisi, setDenemeSayisi] = useState<number>(5);
  const [konuSayisi, setKonuSayisi] = useState<number>(5);
  const [dersId, setDersId] = useState<string | null>(null);
  const [dersler, setDersler] = useState<Ders[]>([]);
  const [isTyt, setIsTyt] = useState<boolean>(true);
  const [alanTur, setAlanTur] = useState<string>("Sayısal"); // New state for subject type
  const [type, setType] = useState<string>("yanlis");
  const [loading, setLoading] = useState<boolean>(false);
  

  const fetchAnaliz = async () => {
    if (!dersId) return;
    setLoading(true);
    try {
      const result = isTyt
        ? await denemeService.getTytAnaliz(
            denemeSayisi,
            konuSayisi,
            dersId,
            type
          )
        : await denemeService.getAytAnaliz(
            denemeSayisi,
            konuSayisi,
            dersId,
            type
          );

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
    fetchAnaliz();
  }, [dersId, denemeSayisi, konuSayisi, type, isTyt]);

  const fetchDersler = async () => {
    try {
      const response = await derslerService.getAllDers(isTyt);
      const filteredDersler = response.dersler.filter((ders) => {
        if (isTyt) return true; // For TYT, return all dersler
        switch (alanTur) {
          case "Sayısal":
            return ["Matematik", "Fizik", "Kimya", "Biyoloji"].includes(
              ders.dersAdi
            );
          case "Eşit Ağırlık":
            return ["Edebiyat", "Matematik", "Tarih1", "Coğrafya1"].includes(
              ders.dersAdi
            );
          case "Sözel":
            return [
              "Edebiyat",
              "Tarih1",
              "Coğrafya1",
              "Tarih2",
              "Coğrafya2",
              "Felsefe",
              "Din",
            ].includes(ders.dersAdi);
          case "Dil":
            return ders.dersAdi === "Dil";
          default:
            return false;
        }
      });

      const sortedDersler = filteredDersler.sort((a, b) => {
        const order = isTyt
          ? ["Türkçe", "Matematik", "Fen", "Sosyal"]
          : [
              "Matematik",
              "Fizik",
              "Kimya",
              "Biyoloji",
              "Edebiyat",
              "Tarih1",
              "Coğrafya1",
              "Tarih2",
              "Coğrafya2",
              "Felsefe",
              "Din",
              "Dil",
            ];
        return order.indexOf(a.dersAdi) - order.indexOf(b.dersAdi);
      });
      setDersler(sortedDersler);
      if (sortedDersler.length > 0) {
        setDersId(sortedDersler[0].id);
      }
    } catch (error) {
      toast({
        title: "Hata",
        description: "Dersler alınırken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchDersler();
  }, [isTyt, alanTur]); // Fetch dersler whenever isTyt or alanTur changes

  // Grafik verilerini hazırlama
  const chartData = analiz.map((item) => ({
    name: item.konuAdi,
    value: item.sayi,
  }));

  const chartConfig = {
    konu: {
      label: "Konu",
      color: "hsl(var(--chart-1))", // Renk ayarını buradan al
    },
    sayi: {
      label: "Sayı",
      color: "hsl(var(--chart-2))", // Renk ayarını buradan al
    },
  } satisfies ChartConfig;

  const CustomTooltip: React.FC<TooltipProps<number, string>> = ({
    active,
    payload,
  }) => {
    if (active && payload && payload.length) {
      const { name, value } = payload[0].payload; // payload'dan konu adı ve sayı alın
      return (
        <div className="custom-tooltip bg-gray-800 text-white p-2 rounded-md shadow-md w-48">
          <p className="label text-center text-base font-normal">{`${name}`}</p>
          <p className="desc text-center text-base">{`${value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="max-w-md mt-4 mx-auto">
      <CardHeader>
        <CardTitle>{isTyt ? "TYT Konu Analizi" : "AYT Konu Analizi"}</CardTitle>
        <CardHeader>
          <CardDescription>
            Son {denemeSayisi} denemede{" "}
            {dersId ? `${dersler.find((d) => d.id === dersId)?.dersAdi}` : ""}{" "}
            dersi için en fazla {type === "yanlis" ? "yanlış" : "boş"} yapılan{" "}
            {analiz.length < konuSayisi ? analiz.length : konuSayisi} konu{" "}
          </CardDescription>
        </CardHeader>
      </CardHeader>
      <CardContent>
        {loading ? (
                <SpinnerMethodComponent />
        ) : analiz.length === 0 ? (
          <div className="text-center py-10">
            {dersId ? `${dersler.find((d) => d.id === dersId)?.dersAdi}` : ""}{" "}
            dersi için {type === "yanlis" ? "yanlış" : "boş"} konu
            bulunmamaktadır.
          </div>
        ) : (
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="name" tickLine={false} />
                <YAxis />
                <ChartTooltip
                  content={<CustomTooltip />} // CustomTooltip kullan
                  cursor={false}
                  defaultIndex={0}
                />
                <Bar
                  dataKey="value"
                  fill={chartConfig.konu.color}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <h2 className="text-lg font-semibold">Deneme Türü</h2>
        <Select
          value={isTyt ? "TYT" : "AYT"}
          onValueChange={(value) => setIsTyt(value === "TYT")}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="TYT">TYT</SelectItem>
            <SelectItem value="AYT">AYT</SelectItem>
          </SelectContent>
        </Select>
        <h2 className="text-lg font-semibold">Konu Türü</h2>
        <Select value={type} onValueChange={(value) => setType(value)}>
          <SelectTrigger className="h-8 w-full">
            <SelectValue placeholder={type} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="yanlis">Yanlış</SelectItem>
            <SelectItem value="bos">Boş</SelectItem>
          </SelectContent>
        </Select>
        <h2 className="text-lg font-semibold">Deneme Sayısı</h2>
        <Select
          value={denemeSayisi.toString()}
          onValueChange={(value) => setDenemeSayisi(parseInt(value))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[5, 10, 15, 20].map((value) => (
              <SelectItem key={value} value={value.toString()}>
                {value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <h2 className="text-lg font-semibold">Konu Sayısı</h2>
        <Select
          value={konuSayisi.toString()}
          onValueChange={(value) => setKonuSayisi(parseInt(value))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[5, 10, 15, 20].map((value) => (
              <SelectItem key={value} value={value.toString()}>
                {value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {!isTyt && ( // Show only when isTyt is false
          <>
            <h2 className="text-lg font-semibold">Alan Türü</h2>
            <Select value={alanTur} onValueChange={setAlanTur}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Sayısal">Sayısal</SelectItem>
                <SelectItem value="Eşit Ağırlık">Eşit Ağırlık</SelectItem>
                <SelectItem value="Sözel">Sözel</SelectItem>
                <SelectItem value="Dil">Dil</SelectItem>
              </SelectContent>
            </Select>
          </>
        )}
        <h2 className="text-lg font-semibold">Dersler</h2>
        <Select value={dersId || ""} onValueChange={setDersId}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {dersler.map((ders) => (
              <SelectItem key={ders.id} value={ders.id}>
                {ders.dersAdi}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardFooter>
    </Card>
  );
};

export default BosYanlisAnalizler;
