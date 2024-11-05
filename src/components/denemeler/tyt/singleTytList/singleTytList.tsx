"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { z } from "zod"; 
import { derslerService } from "@/app/services/dersler.service";
import { Ders, Konu, ListKonu, TytSingleList, UpdateKonu, UpdateTyt } from "@/types";
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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronsUpDown } from "lucide-react";
import SpinnerMethodComponent from "@/app/spinner/spinnerForMethods";

// Zod schema


const SingleTytContent = () => {
  const { id } = useParams();
  const [tyt, setTyt] = useState<TytSingleList | null>(null);
  const signalRService = useSignalR();
  const [dersler, setDersler] = useState<Ders[]>([]);
  const subjects = ['Türkçe', 'Matematik', 'Fen', 'Sosyal'] as const;
  const [yanlisKonularId, setYanlisKonularId] = useState<string[]>([]);
  const [bosKonularId, setBosKonularId] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
  const [selectedDersId, setSelectedDersId] = useState<string | null>(null);
  const [konular, setKonular] = useState<Konu[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const isTytSelected=true;
  const [loading, setLoading] = useState(true);

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
    Türkçe: {
      correct: Number(tyt?.turkceDogru),
      incorrect: Number(tyt?.turkceYanlis),
    },
    Matematik: {
      correct: Number(tyt?.matematikDogru),
      incorrect: Number(tyt?.matematikYanlis),
    },
    Fen: {
      correct: Number(tyt?.fenDogru),
      incorrect: Number(tyt?.fenYanlis),
    },
    Sosyal: {
      correct: Number(tyt?.sosyalDogru),
      incorrect: Number(tyt?.sosyalYanlis),
    },
    
  });
  const maxLimits: MaxLimitsType = {
    Türkçe: { correct: 40, incorrect: 40, total: 40 },
    Matematik: { correct: 40, incorrect: 40, total: 40 },
    Fen: { correct: 20, incorrect: 20, total: 20 },
    Sosyal: { correct: 20, incorrect: 20, total: 20 },
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
    const newErrors: { [key in typeof subjects[number]]: string[] } = {
      Türkçe: [],
      Matematik: [],
      Fen: [],
      Sosyal: [],
    };
    subjects.forEach((subject) => {
      const totalScore = newScores[subject].correct + newScores[subject].incorrect;

      if (newScores[subject].correct < 0 || newScores[subject].incorrect < 0) {
        newErrors[subject].push(`${subject} için doğru ve yanlış puanı negatif olamaz.`);
      }
      if (newScores[subject].correct > maxLimits[subject].correct) {
        newErrors[subject].push(`${subject} doğru 0 ile ${maxLimits[subject].correct} arasında olmalıdır.`);
      }
      if (newScores[subject].incorrect > maxLimits[subject].incorrect) {
        newErrors[subject].push(`${subject} yanlış 0 ile ${maxLimits[subject].incorrect} arasında olmalıdır.`);
      }
      if (totalScore > maxLimits[subject].total) {
        newErrors[subject].push(`${subject} alanı için toplam ${maxLimits[subject].total} soru girilmelidir.`);
      }
    });

    setErrors(newErrors); 
  }
   const handleSubmit = async () => {
     const newErrors: { [key in (typeof subjects)[number]]: string[] } = {
       Türkçe: [],
       Matematik: [],
       Fen: [],
       Sosyal: [],
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
     const tytUpdate: UpdateTyt = {
       tytId: id as string,
       matematikDogru: scores.Matematik.correct,
       matematikYanlis: scores.Matematik.incorrect,
       turkceDogru: scores.Türkçe.correct,
       turkceYanlis: scores.Türkçe.incorrect,
       fenDogru: scores.Fen.correct,
       fenYanlis: scores.Fen.incorrect,
       sosyalDogru: scores.Sosyal.correct,
       sosyalYanlis: scores.Sosyal.incorrect,
       yanlisKonular: yanlisKonularId,
       bosKonular: bosKonularId,
     };
     setLoading(true);

     try {
       await denemeService.editTyt(tytUpdate, undefined, () => {
         toast({
           title: "Başarısız",
           description: `TYT denemesi güncellenirken bir hata oluştu.`,
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
  const fetchTyt = async () => {
    if (!id) return;
     setLoading(true);

    const fetchedTyt = await denemeService.getTytById(id as string);
    setTyt(fetchedTyt);
    if (fetchedTyt) {
      setScores({
        Türkçe: {
          correct: fetchedTyt.turkceDogru,
          incorrect: fetchedTyt.turkceYanlis,
        },
        Matematik: {
          correct: fetchedTyt.matematikDogru,
          incorrect: fetchedTyt.matematikYanlis,
        },
        Fen: { correct: fetchedTyt.fenDogru, incorrect: fetchedTyt.fenYanlis },
        Sosyal: {
          correct: fetchedTyt.sosyalDogru,
          incorrect: fetchedTyt.sosyalYanlis,
        },
      });
      setYanlisKonularId(
        fetchedTyt.yanlisKonularAdDers.map((konu) => konu.konuId)
      );
      setBosKonularId(fetchedTyt.bosKonularAdDers.map((konu) => konu.konuId));
    }
     setLoading(false);

  };
  useEffect(() => {
    fetchTyt();
  }, []);
  useEffect(() => {
    const fetchDersler = async () => {
     setLoading(true);

      try {
        const response = await derslerService.getAllDers(isTytSelected);
        const sortedDersler = response.dersler.sort((a, b) => {
          const order = ["Türkçe", "Matematik", "Fen", "Sosyal"];
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
  },[]);
  
  
  
  useEffect(() => {
    const userId = authService.userId as string; 
    signalRService.start(HubUrls.TytHub,userId);
    signalRService.on(HubUrls.TytHub, ReceiveFunctions.TytUpdatedMessage, async (message) => {
      fetchTyt();
        toast({
          title: 'Başarılı',
          description: message,
        });
    }, userId);
    return () => {
        signalRService.off(HubUrls.TytHub, ReceiveFunctions.TytUpdatedMessage, userId);
    };
  }, [signalRService]);
  
  if (!tyt) return (
    <div className="text-center mt-2">
      {loading && <SpinnerMethodComponent />}
      TYT denemesi bulunamaadı.
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
        className="grid grid-cols-1 gap-12"
      >
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
                TYT denemesini güncellemek istediğinize emin misiniz?
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

export default SingleTytContent;
