"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { z } from "zod";
import { derslerService } from "@/app/services/dersler.service";
import {
  AytSingleList,
  Ders,
  Konu,
  ListKonu,
  UpdateAyt,
} from "@/types";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useSignalR } from "@/hooks/use-signalr";
import { HubUrls } from "@/types/hubUrls";
import { ReceiveFunctions } from "@/types/receiveFunctions";
import { konularService } from "@/app/services/konular.service";
import CustomToggleDersler from "@/app/admin/dersler/custom.toggle.dersler";
import { denemeService } from "@/app/services/denemeler.service";
import authService from "@/app/services/auth.service";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronsUpDown } from "lucide-react";
import SpinnerMethodComponent from "@/app/spinner/spinnerForMethods";

// Zod schema

const SingleAytContent = () => {
  const { id } = useParams();
  const [ayt, setAyt] = useState<AytSingleList | null>(null);
  const signalRService = useSignalR();
  const [dersler, setDersler] = useState<Ders[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(true);

  const subjects = [
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
  ] as const;
  const [yanlisKonularId, setYanlisKonularId] = useState<string[]>([]);
  const [bosKonularId, setBosKonularId] = useState<string[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
  const [selectedDersId, setSelectedDersId] = useState<string | null>(null);
  const [konular, setKonular] = useState<Konu[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const isTytSelected = false;
  const subjectSchema = z
    .object({
      correct: z.number().min(0).max(40),
      incorrect: z.number().min(0).max(40),
    })
    .refine((data) => data.correct + data.incorrect <= 40, {
      message: "Toplam soru 40'ı geçemez",
    });
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
  const [isDialogOpen, setDialogOpen] = useState(false);
  const handleUpdateClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setDialogOpen(true); // Dialog'u aç
  };
  const [scores, setScores] = useState<ScoresType>({
    Matematik: {
      correct: Number(ayt?.matematikDogru),
      incorrect: Number(ayt?.matematikYanlis),
    },
    Fizik: {
      correct: Number(ayt?.fizikDogru),
      incorrect: Number(ayt?.fizikYanlis),
    },
    Kimya: {
      correct: Number(ayt?.kimyaDogru),
      incorrect: Number(ayt?.kimyaYanlis),
    },
    Biyoloji: {
      correct: Number(ayt?.biyolojiDogru),
      incorrect: Number(ayt?.biyolojiYanlis),
    },
    Edebiyat: {
      correct: Number(ayt?.edebiyatDogru),
      incorrect: Number(ayt?.edebiyatYanlis),
    },
    Tarih1: {
      correct: Number(ayt?.tarih1Dogru),
      incorrect: Number(ayt?.tarih1Yanlis),
    },
    Coğrafya1: {
      correct: Number(ayt?.cografya1Dogru),
      incorrect: Number(ayt?.cografya1Yanlis),
    },
    Tarih2: {
      correct: Number(ayt?.tarih2Dogru),
      incorrect: Number(ayt?.tarih2Yanlis),
    },
    Coğrafya2: {
      correct: Number(ayt?.cografya2Dogru),
      incorrect: Number(ayt?.cografya2Yanlis),
    },
    Felsefe: {
      correct: Number(ayt?.felsefeDogru),
      incorrect: Number(ayt?.felsefeYanlis),
    },
    Din: {
      correct: Number(ayt?.dinDogru),
      incorrect: Number(ayt?.dinYanlis),
    },
    Dil: {
      correct: Number(ayt?.dilDogru),
      incorrect: Number(ayt?.dilYanlis),
    },
  });
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
    const newErrors: { [key in (typeof subjects)[number]]: string[] } = {
      Matematik: [],
      Fizik: [],
      Kimya: [],
      Biyoloji: [],
      Edebiyat: [],
      Tarih1: [],
      Coğrafya1: [],
      Tarih2: [],
      Coğrafya2: [],
      Felsefe: [],
      Din: [],
      Dil: [],
    };
    subjects.forEach((subject) => {
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
    });

    setErrors(newErrors);
  };
   const handleSubmit = async () => {
     const newErrors: { [key in (typeof subjects)[number]]: string[] } = {
       Matematik: [],
       Fizik: [],
       Kimya: [],
       Biyoloji: [],
       Edebiyat: [],
       Tarih1: [],
       Coğrafya1: [],
       Tarih2: [],
       Coğrafya2: [],
       Felsefe: [],
       Din: [],
       Dil: [],
     };
     subjects.forEach((subject) => {
       const totalScore = scores[subject].correct + scores[subject].incorrect;

       if (scores[subject].correct < 0 || scores[subject].incorrect < 0) {
         newErrors[subject].push(
           `${subject} için doğru ve yanlış soru sayısı negatif olamaz.`
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
     });

     if (Object.values(newErrors).flat().length > 0) {
       setErrors(newErrors); // Hata mesajlarını ayarla
       // Hataları toast ile göster
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
     const aytUpdate: UpdateAyt = {
       aytId: id as string,
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
       yanlisKonular: yanlisKonularId,
       bosKonular: bosKonularId,
     };
     setLoading(true);
     try {
       await denemeService.editAyt(aytUpdate, undefined, () => {
         toast({
           title: "Başarısız",
           description: `AYT denemesi güncellenirken bir hata oluştu.`,
           variant: "destructive",
         });
       });
     } catch (error: any) {}
     setLoading(false);

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
  
  const fetchAyt = async () => {
    if (!id) return;
    setLoading(true);
    const fetchedAyt = await denemeService.getAytById(id as string);
    setAyt(fetchedAyt);
    if (fetchedAyt) {
      setScores({
        Matematik: {
          correct: fetchedAyt.matematikDogru,
          incorrect: fetchedAyt.matematikYanlis,
        },
        Fizik: {
          correct: fetchedAyt.fizikDogru,
          incorrect: fetchedAyt.fizikYanlis,
        },
        Kimya: {
          correct: fetchedAyt.kimyaDogru,
          incorrect: fetchedAyt.kimyaYanlis,
        },
        Biyoloji: {
          correct: fetchedAyt.biyolojiDogru,
          incorrect: fetchedAyt.biyolojiYanlis,
        },
        Edebiyat: {
          correct: fetchedAyt.edebiyatDogru,
          incorrect: fetchedAyt.edebiyatYanlis,
        },
        Tarih1: {
          correct: fetchedAyt.tarih1Dogru,
          incorrect: fetchedAyt.tarih1Yanlis,
        },
        Coğrafya1: {
          correct: fetchedAyt.cografya1Dogru,
          incorrect: fetchedAyt.cografya1Yanlis,
        },
        Tarih2: {
          correct: fetchedAyt.tarih2Dogru,
          incorrect: fetchedAyt.tarih2Yanlis,
        },
        Coğrafya2: {
          correct: fetchedAyt.cografya2Dogru,
          incorrect: fetchedAyt.cografya2Yanlis,
        },
        Felsefe: {
          correct: fetchedAyt.felsefeDogru,
          incorrect: fetchedAyt.felsefeYanlis,
        },
        Din: {
          correct: fetchedAyt.dinDogru,
          incorrect: fetchedAyt.dinYanlis,
        },
        Dil: {
          correct: fetchedAyt.dilDogru,
          incorrect: fetchedAyt.dilYanlis,
        },
      });
      setYanlisKonularId(fetchedAyt.yanlisKonularAdDers.map((konu) => konu.konuId));
      setBosKonularId(fetchedAyt.bosKonularAdDers.map((konu) => konu.konuId));
    }
    setLoading(false);

  };
  useEffect(() => {
    fetchAyt();
  }, []);
  useEffect(() => {
    const fetchDersler = async () => {
      setLoading(true);
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
      setLoading(false);

    };
    fetchDersler();
  }, []);

 useEffect(() => {
   const userId = authService.userId as string;
   signalRService.start(HubUrls.AytHub, userId);
   signalRService.on(
     HubUrls.AytHub,
     ReceiveFunctions.AytUpdatedMessage,
     async (message) => {
       fetchAyt();
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
       ReceiveFunctions.AytUpdatedMessage,
       userId
     );
   };
 }, [signalRService]);
  if (!ayt)
    return (
      <div className="text-center mt-2">
        {loading && <SpinnerMethodComponent />}
        AYT denemesi bulunamaadı.
      </div>
    );
  return (
    <div className="mx-auto mt-4 max-w-7xl">
      {loading && <SpinnerMethodComponent />}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setOpenDialog(true); // Open dialog on form submit
        }}
        className="grid grid-cols-1 gap-8"
      >
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

        <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
          <AlertDialogTrigger asChild>
            <Button className="w-full mt-4" type="button">
              Güncelle
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Güncelleme Onayı</AlertDialogTitle>
              <AlertDialogDescription>
                AYT denemesini güncellemek istediğinize emin misiniz?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setOpenDialog(false)}>
                İptal
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  handleSubmit(); // Call submit function on confirmation
                  setOpenDialog(false); // Close the dialog
                }}
              >
                Güncelle
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </form>
    </div>
  );
};

export default SingleAytContent;
