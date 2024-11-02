"use client";

import { denemeService } from '@/app/services/denemeler.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreateAyt, Ders, Konu } from '@/types';
import React, { useEffect, useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { derslerService } from '@/app/services/dersler.service';
import { konularService } from '@/app/services/konular.service';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ChevronDownIcon, ChevronsUpDown, ChevronUpIcon } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { useSignalR } from '@/hooks/use-signalr';
import authService from '@/app/services/auth.service';
import { HubUrls } from '@/types/hubUrls';
import { ReceiveFunctions } from '@/types/receiveFunctions';

// Skorların tipi
type ScoreType = {
  correct: number;
  incorrect: number;
};
type ScoresType = {
  [key: string]: ScoreType;
};

type MaxLimitsType = {
  [key: string]: {
    correct: number;
    incorrect: number;
    total: number;
  };
};
interface AytCreateProps {
  isTytSelected: boolean; // isTytSelected prop'u ekleyin
}
const AytCreate : React.FC<AytCreateProps> = ({ isTytSelected }) => {
  const [scores, setScores] = useState<ScoresType>({});
  const [dersler, setDersler] = useState<Ders[]>([]);
  const [selectedDersId, setSelectedDersId] = useState<string | null>(null);
  const [konular, setKonular] = useState<Konu[]>([]);
  const [yanlisKonularId, setYanlisKonularId] = useState<string[]>([]);
  const [bosKonularId, setBosKonularId] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
  const signalRService = useSignalR();
  useEffect(() => {
    const userId = authService.userId as string;
    signalRService.start(HubUrls.AytHub, userId);
    signalRService.on(
      HubUrls.AytHub,
      ReceiveFunctions.AytAddedMessage,
      async (message) => {
        toast({
          title: "Başarılı",
          description: message,
        });
      },
      userId
    );
    return () => {
      signalRService.off(
        HubUrls.AytHub,
        ReceiveFunctions.AytAddedMessage,
        userId
      );
    };
  }, [signalRService]);
  const maxLimits: MaxLimitsType = {
    Matematik: { correct: 40, incorrect: 40, total: 40 },
    Fizik: { correct: 14, incorrect: 14, total: 14 },
    Kimya: { correct: 13, incorrect: 13, total: 13 },
    Biyoloji: { correct: 13, incorrect: 13, total: 13 },
    Edebiyat: { correct: 24, incorrect: 24, total: 24 },
    Tarih1: { correct: 10, incorrect: 10, total: 10 },
    Coğrafya1: { correct: 6, incorrect: 6, total: 6 },
    Tarih2: { correct: 11, incorrect: 11, total: 11 },
    Coğrafya2: { correct: 11, incorrect: 11, total: 11 },
    Felsefe: { correct: 12, incorrect: 12, total: 12 },
    Din: { correct: 6, incorrect: 6, total: 6 },
    Dil: { correct: 80, incorrect: 80, total: 80 },
  };
  const handleDersClick = async (dersId: string) => {
    if (selectedDersId === dersId) {
      setSelectedDersId(null); // Aynı derse tekrar tıklanırsa kapat
    } else {
      setSelectedDersId(dersId); // Yeni ders seçimi
      try {
        const response = await konularService.getAllKonular(
          isTytSelected,
          undefined,
          undefined,
          undefined,
          [dersId]
        );
        setKonular(response.konular); // Konuları güncelle
      } catch (error) {
        toast({
          title: "Hata",
          description: "Konular alınırken bir hata oluştu.",
          variant: "destructive",
        });
      }
    }
  };
  const handleScoreChange = (
    subject: string,
    type: "correct" | "incorrect",
    value: string
  ) => {
    const numberValue = Number(value);
    const newScores = {
      ...scores,
      [subject]: {
        ...scores[subject],
        [type]: isNaN(numberValue) ? 0 : numberValue,
      },
    };
    setScores(newScores); // Güncellenmiş değerleri ayarla
    validateScores(newScores);
  };
  const validateScores = (newScores: ScoresType) => {
    const newErrors: { [key: string]: string[] } = {};

    for (const subject of Object.keys(newScores)) {
      newErrors[subject] = [];
      const totalScore =
        newScores[subject].correct + newScores[subject].incorrect;

      if (newScores[subject].correct < 0 || newScores[subject].incorrect < 0) {
        newErrors[subject].push(
          `${subject} için doğru ve yanlış puanı negatif olamaz.`
        );
      }
      if (newScores[subject].correct > maxLimits[subject].correct) {
        newErrors[subject].push(
          `${subject} doğru 0 ile ${maxLimits[subject].correct} arasında olmalıdır.`
        );
      }
      if (newScores[subject].incorrect > maxLimits[subject].incorrect) {
        newErrors[subject].push(
          `${subject} yanlış 0 ile ${maxLimits[subject].incorrect} arasında olmalıdır.`
        );
      }
      if (totalScore > maxLimits[subject].total) {
        newErrors[subject].push(
          `${subject} alanı için toplam ${maxLimits[subject].total} soru girilmelidir.`
        );
      }
    }

    setErrors(newErrors); // Hata mesajlarını ayarla
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string[] } = {};

    for (const subject of Object.keys(scores)) {
      newErrors[subject] = [];
      const totalScore = scores[subject].correct + scores[subject].incorrect;

      if (scores[subject].correct < 0 || scores[subject].incorrect < 0) {
        newErrors[subject].push(
          `${subject} için doğru ve yanlış puanı negatif olamaz.`
        );
      }
      if (scores[subject].correct > maxLimits[subject].correct) {
        newErrors[subject].push(
          `${subject} doğru 0 ile ${maxLimits[subject].correct} arasında olmalıdır.`
        );
      }
      if (scores[subject].incorrect > maxLimits[subject].incorrect) {
        newErrors[subject].push(
          `${subject} yanlış 0 ile ${maxLimits[subject].incorrect} arasında olmalıdır.`
        );
      }
      if (totalScore > maxLimits[subject].total) {
        newErrors[subject].push(
          `${subject} alanı için toplam ${maxLimits[subject].total} soru girilmelidir.`
        );
      }
    }

    if (Object.values(newErrors).flat().length > 0) {
      setErrors(newErrors); // Hata mesajlarını ayarla
      Object.values(newErrors)
        .flat()
        .forEach((error) => {
          toast({
            title: "Hata",
            description: error,
            variant: "destructive",
          });
        });
      return; 
    }

    const aytDeneme: CreateAyt = {
      matematikDogru: scores.Matematik.correct,
      matematikYanlis: scores.Matematik.incorrect,
      fizikDogru: scores.Fizik.correct,
      fizikYanlis: scores.Fizik.incorrect,
      kimyaDogru: scores.Kimya.correct,
      kimyaYanlis: scores.Kimya.incorrect,
      biyolojiDogru: scores.Biyoloji.correct,
      biyolojiYanlis: scores.Biyoloji.incorrect,
      edebiyatDogru: scores.Edebiyat.correct,
      edebiyatYanlis: scores.Edebiyat.incorrect,
      tarih1Dogru: scores.Tarih1.correct,
      tarih1Yanlis: scores.Tarih1.incorrect,
      cografya1Dogru: scores.Coğrafya1.correct,
      cografya1Yanlis: scores.Coğrafya1.incorrect,
      tarih2Dogru: scores.Tarih2.correct,
      tarih2Yanlis: scores.Tarih2.incorrect,
      cografya2Dogru: scores.Coğrafya2.correct,
      cografya2Yanlis: scores.Coğrafya2.incorrect,
      felsefeDogru: scores.Felsefe.correct,
      felsefeYanlis: scores.Felsefe.incorrect,
      dinDogru: scores.Din.correct,
      dinYanlis: scores.Din.incorrect,
      dilDogru: scores.Dil.correct,
      dilYanlis: scores.Dil.incorrect,
      yanlisKonularId: yanlisKonularId,
      bosKonularId: bosKonularId,
    };

    try {
      await denemeService.createAyt(aytDeneme);
    } catch (error: any) {
      toast({
        title: "Başarısız",
        description: `AYT denemesi eklenirken bir hata oluştu.`,
        variant: "destructive",
      });
    }
  };


  useEffect(() => {
    const fetchDersler = async () => {
      try {
        const response = await derslerService.getAllDers(isTytSelected);
        const sortedDersler = response.dersler.sort((a, b) => {
          const order = [
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
        setDersler(sortedDersler); // Sıralanmış dersleri ayarla

        // Skorları başlangıçta sıfır olarak ayarla
        const initialScores: ScoresType = {};
        sortedDersler.forEach((ders) => {
          initialScores[ders.dersAdi] = { correct: 0, incorrect: 0 };
        });
        setScores(initialScores); // Başlangıçta skorları ayarla

        const initialErrors: { [key: string]: string[] } = {};
        sortedDersler.forEach((ders) => {
          initialErrors[ders.dersAdi] = [];
        });
        setErrors(initialErrors); // Başlangıçta hataları ayarla
      } catch (error) {
        toast({
          title: "Hata",
          description: "Dersler alınırken bir hata oluştu.",
          variant: "destructive",
        });
      }
    };
    fetchDersler();
  }, [isTytSelected]);
  
  return (
    <div className="mx-auto mt-4 max-w-7xl">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {dersler.map((ders) => (
            <div key={ders.id} className="flex flex-col gap-2">
              <Label className="text-lg font-semibold">{ders.dersAdi}</Label>
              <div className="flex gap-4">
                <div className="flex items-center w-full">
                  <label className="text-sm mr-2">Doğru</label>
                  <Input
                    type="number"
                    value={scores[ders.dersAdi]?.correct || 0}
                    onChange={(e) =>
                      handleScoreChange(ders.dersAdi, "correct", e.target.value)
                    }
                    placeholder="Doğru"
                    className={`border ${
                      errors[ders.dersAdi].length > 0
                        ? "border-red-500"
                        : "border-gray-300"
                    } w-full`}
                  />
                </div>
                <div className="flex items-center w-full">
                  <label className="text-sm mr-2">Yanlış</label>
                  <Input
                    type="number"
                    value={scores[ders.dersAdi]?.incorrect || 0}
                    onChange={(e) =>
                      handleScoreChange(
                        ders.dersAdi,
                        "incorrect",
                        e.target.value
                      )
                    }
                    placeholder="Yanlış"
                    className={`border ${
                      errors[ders.dersAdi].length > 0
                        ? "border-red-500"
                        : "border-gray-300"
                    } w-full`}
                  />
                </div>
              </div>
              {errors[ders.dersAdi].map((error, index) => (
                <span key={index} className="text-red-500 text-sm">
                  {error}
                </span>
              ))}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    className="flex items-center justify-between w-full mt-2"
                    onClick={() => {
                      handleDersClick(ders.id);
                      setSearchTerm("");
                    }}
                  >
                    <span className="mr-2 text-left">
                      Yanlış veya Boş Konu Seç
                    </span>
                    <ChevronsUpDown className="h-5 w-5" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full max-h-60 overflow-auto p-0">
                  <ScrollArea className="h-48 w-72 rounded-md border">
                    <input
                      type="text"
                      placeholder="Konu arayın..."
                      className="w-full mb-2 border p-1 rounded"
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="flex flex-col">
                      {konular.filter((konu) =>
                        konu.konuAdi
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase())
                      ).length > 0 ? (
                        konular
                          .filter((konu) =>
                            konu.konuAdi
                              .toLowerCase()
                              .includes(searchTerm.toLowerCase())
                          )
                          .map((konu) => (
                            <div
                              key={konu.id}
                              className="flex items-center justify-between px-2 py-1"
                            >
                              <div className="flex-1 flex flex-col">
                                <span className="break-all">
                                  {konu.konuAdi}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 ml-4">
                                <div className="flex items-center">
                                  <Checkbox
                                    id={`yanlis-${konu.id}`}
                                    checked={yanlisKonularId.includes(konu.id)}
                                    onCheckedChange={(e) => {
                                      const isChecked = e.valueOf();
                                      setYanlisKonularId((prev) => {
                                        if (isChecked)
                                          return !prev.includes(konu.id)
                                            ? [...prev, konu.id]
                                            : prev;
                                        return prev.filter(
                                          (id) => id !== konu.id
                                        );
                                      });
                                    }}
                                  />
                                  <label
                                    htmlFor={`yanlis-${konu.id}`}
                                    className="ml-1"
                                  >
                                    Yanlış
                                  </label>
                                </div>
                                <div className="flex items-center mr-4">
                                  <Checkbox
                                    id={`bos-${konu.id}`}
                                    checked={bosKonularId.includes(konu.id)}
                                    onCheckedChange={(e) => {
                                      const isChecked = e.valueOf();
                                      setBosKonularId((prev) => {
                                        if (isChecked)
                                          return !prev.includes(konu.id)
                                            ? [...prev, konu.id]
                                            : prev;
                                        return prev.filter(
                                          (id) => id !== konu.id
                                        );
                                      });
                                    }}
                                  />
                                  <label
                                    htmlFor={`bos-${konu.id}`}
                                    className="ml-1"
                                  >
                                    Boş
                                  </label>
                                </div>
                              </div>
                            </div>
                          ))
                      ) : (
                        <div className="px-2 py-1">Konu bulunamadı.</div>
                      )}
                    </div>
                  </ScrollArea>
                </PopoverContent>
              </Popover>
            </div>
          ))}
        </div>
        <Button className="w-full mt-4" type="submit">
          Deneme Ekle
        </Button>
      </form>
    </div>
  );
};

export default AytCreate;
