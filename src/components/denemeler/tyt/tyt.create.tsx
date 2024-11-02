"use client";

import { denemeService } from "@/app/services/denemeler.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreateTyt, Ders, Konu } from "@/types";
import React, { useEffect, useState } from "react";
import { z } from "zod";
import { toast } from "@/hooks/use-toast";
import { derslerService } from "@/app/services/dersler.service";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { ChevronDownIcon, ChevronsDownUp, ChevronsUpDown, ChevronUpIcon } from "lucide-react";
import { konularService } from "@/app/services/konular.service";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import authService from "@/app/services/auth.service";
import { HubUrls } from "@/types/hubUrls";
import { useSignalR } from "@/hooks/use-signalr";
import { ReceiveFunctions } from "@/types/receiveFunctions";

// Zod Schema Tanımları
const subjectSchema = z
  .object({
    correct: z.number().min(0).max(40),
    incorrect: z.number().min(0).max(40),
  })
  .refine((data) => data.correct + data.incorrect <= 40, {
    message: "Toplam soru 40'ı geçemez",
  });

// Skorların tipi
type ScoreType = {
  correct: number;
  incorrect: number;
};

// Skorlar durumunun tipi
type ScoresType = {
  [key: string]: ScoreType;
};

// Maksimum limitlerin tipi
type MaxLimitsType = {
  [key: string]: {
    correct: number;
    incorrect: number;
    total: number;
  };
};

interface TytCreateProps {
  isTytSelected: boolean;
}

const TytCreate: React.FC<TytCreateProps> = ({ isTytSelected }) => {
  const [scores, setScores] = useState<ScoresType>({});
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
  const [dersler, setDersler] = useState<Ders[]>([]);
  const [selectedDersId, setSelectedDersId] = useState<string | null>(null);
  const [konular, setKonular] = useState<Konu[]>([]);

  const maxLimits: MaxLimitsType = {
    Türkçe: { correct: 40, incorrect: 40, total: 40 },
    Matematik: { correct: 40, incorrect: 40, total: 40 },
    Fen: { correct: 20, incorrect: 20, total: 20 },
    Sosyal: { correct: 20, incorrect: 20, total: 20 },
  };

  useEffect(() => {
    const fetchDersler = async () => {
      try {
        const response = await derslerService.getAllDers(isTytSelected);
        const sortedDersler = response.dersler.sort((a, b) => {
          const order = ["Türkçe", "Matematik", "Fen", "Sosyal"];
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
      if (!scores[subject]) {
        newErrors[subject] = ["Skor bilgisi eksik."]; // Handle missing subject
        continue;
      }
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
  const signalRService = useSignalR();
  
  const [yanlisKonularId, setYanlisKonularId] = useState<string[]>([]);
  const [bosKonularId, setBosKonularId] = useState<string[]>([]); 
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const userId = authService.userId as string;
    signalRService.start(HubUrls.TytHub, userId);
    signalRService.on(
      HubUrls.TytHub,
      ReceiveFunctions.TytAddedMessage,
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
        HubUrls.TytHub,
        ReceiveFunctions.TytAddedMessage,
        userId
      );
    };
  }, [signalRService]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string[] } = {};

    // Iterate over all subjects to validate scores
    for (const subject of Object.keys(scores)) {
      newErrors[subject] = [];
      const totalScore =
        (scores[subject]?.correct || 0) + (scores[subject]?.incorrect || 0);

      if (
        (scores[subject]?.correct || 0) < 0 ||
        (scores[subject]?.incorrect || 0) < 0
      ) {
        newErrors[subject].push(
          `${subject} için doğru ve yanlış soru sayısı negatif olamaz.`
        );
      }
      if ((scores[subject]?.correct || 0) > maxLimits[subject].correct) {
        newErrors[subject].push(
          `${subject} doğru 0 ile ${maxLimits[subject].correct} arasında olmalıdır.`
        );
      }
      if ((scores[subject]?.incorrect || 0) > maxLimits[subject].incorrect) {
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
      setErrors(newErrors);
      Object.values(newErrors)
        .flat()
        .forEach((error) => {
          toast({
            title: "Hata",
            description: error,
            variant: "destructive",
          });
        });
      return; // Hatalar varsa formu gönderme
    }

    // Create the tytDeneme object with safe access to scores
    const tytDeneme: CreateTyt = {
      matematikDogru: scores.Matematik?.correct || 0,
      matematikYanlis: scores.Matematik?.incorrect || 0,
      turkceDogru: scores.Türkçe?.correct || 0,
      turkceYanlis: scores.Türkçe?.incorrect || 0,
      fenDogru: scores.Fen?.correct || 0,
      fenYanlis: scores.Fen?.incorrect || 0,
      sosyalDogru: scores.Sosyal?.correct || 0,
      sosyalYanlis: scores.Sosyal?.incorrect || 0,
      yanlisKonularId: yanlisKonularId.length > 0 ? yanlisKonularId : [],
      bosKonularId: bosKonularId.length > 0 ? bosKonularId : [],
    };

    try {
      await denemeService.createTyt(tytDeneme);
    } catch (error: any) {
      toast({
        title: "Başarısız",
        description: `TYT denemesi eklenirken bir hata oluştu.`,
        variant: "destructive",
      });
    }
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
  return (
    <div className="mx-auto mt-4 max-w-7xl">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 justify-center">
          {dersler.map((ders) => (
            <div key={ders.id} className="flex flex-col gap-2">
              <Label className="text-lg">{ders.dersAdi}</Label>
              <div className="flex gap-4 w-full">
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
                              className="flex justify-between items-center px-2 py-1"
                            >
                              <span className="flex-1 break-all">
                                {konu.konuAdi}
                              </span>
                              <div className="flex items-center gap-2 mr-2">
                                <div className="flex items-center">
                                  <Checkbox
                                    id={`yanlis-${konu.id}`}
                                    checked={yanlisKonularId.includes(konu.id)}
                                    onCheckedChange={(e) => {
                                      const isChecked = e.valueOf();
                                      setYanlisKonularId((prev) => {
                                        if (isChecked) {
                                          if (!prev.includes(konu.id))
                                            return [...prev, konu.id];
                                          return prev;
                                        } else {
                                          return prev.filter(
                                            (id) => id !== konu.id
                                          );
                                        }
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
                                        if (isChecked) {
                                          if (!prev.includes(konu.id))
                                            return [...prev, konu.id];
                                          return prev;
                                        } else {
                                          return prev.filter(
                                            (id) => id !== konu.id
                                          );
                                        }
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
        <Button className="w-full" type="submit">
          Deneme Ekle
        </Button>
      </form>
    </div>
  );
};

export default TytCreate;
