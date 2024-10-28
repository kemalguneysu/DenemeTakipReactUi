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
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

// Zod schema


const SingleTytContent = () => {
  const { id } = useParams();
  const [tyt, setTyt] = useState<TytSingleList | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [inputError, setInputError] = useState<string | null>(null);
  const signalRService = useSignalR();
  const [isTyt, setIsTyt] = useState<boolean>(true);
  const [dersler, setDersler] = useState<Ders[]>([]);
  const [selectedDersId, setSelectedDersId] = useState<string>('');
  const [konuAdi, setKonuAdi] = useState<string>('');
  const subjects = ['Türkçe', 'Matematik', 'Fen', 'Sosyal'] as const;
  const subjectSchema = z.object({
    correct: z.number().min(0).max(40),
    incorrect: z.number().min(0).max(40),
  }).refine(data => data.correct + data.incorrect <= 40, {
    message: "Toplam puan 40'ı geçemez",
  });
  type ScoreType = {
    correct: number;
    incorrect: number;
  };
  type ScoresType = {
    [key in typeof subjects[number]]: ScoreType;
  };
  type MaxLimitsType = {
    [key in typeof subjects[number]]: {
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
    Türkçe: { correct: 0, incorrect: 0 },
    Matematik: { correct: 0, incorrect: 0 },
    Fen: { correct: 0, incorrect: 0 },
    Sosyal: { correct: 0, incorrect: 0 },
  });
  const [errors, setErrors] = useState<{ [key in typeof subjects[number]]: string[] }>({
    Türkçe: [],
    Matematik: [],
    Fen: [],
    Sosyal: [],
  });
  const maxLimits: MaxLimitsType = {
    Türkçe: { correct: 40, incorrect: 40, total: 40 },
    Matematik: { correct: 40, incorrect: 40, total: 40 },
    Fen: { correct: 20, incorrect: 20, total: 20 },
    Sosyal: { correct: 20, incorrect: 20, total: 20 },
  };
  const handleScoreChange = (subject: typeof subjects[number], type: 'correct' | 'incorrect', value: string) => {
    const numberValue = Number(value);
    const newScores = { ...scores, [subject]: { ...scores[subject], [type]: isNaN(numberValue) ? 0 : numberValue } };
    setScores(newScores); // Güncellenmiş değerleri ayarla

    // Hata kontrolünü tetikle
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
  const handleSubmit = async () =>{
    const newErrors: { [key in typeof subjects[number]]: string[] } = {
      Türkçe: [],
      Matematik: [],
      Fen: [],
      Sosyal: [],
    };
  
    // Hata kontrolü
    subjects.forEach((subject) => {
      const totalScore = scores[subject].correct + scores[subject].incorrect;
  
      if (scores[subject].correct < 0 || scores[subject].incorrect < 0) {
        newErrors[subject].push(`${subject} için doğru ve yanlış puanı negatif olamaz.`);
      }
      if (scores[subject].correct > maxLimits[subject].correct) {
        newErrors[subject].push(`${subject} doğru 0 ile ${maxLimits[subject].correct} arasında olmalıdır.`);
      }
      if (scores[subject].incorrect > maxLimits[subject].incorrect) {
        newErrors[subject].push(`${subject} yanlış 0 ile ${maxLimits[subject].incorrect} arasında olmalıdır.`);
      }
      if (totalScore > maxLimits[subject].total) {
        newErrors[subject].push(`${subject} alanı için toplam ${maxLimits[subject].total} soru girilmelidir.`);
      }
    });
  
    if (Object.values(newErrors).flat().length > 0) {
      setErrors(newErrors); // Hata mesajlarını ayarla
      // Hataları toast ile göster
      Object.values(newErrors).flat().forEach(error => {
        toast({
          title: 'Hata',
          description: error,
          variant: "destructive",
        });
      });
      return; // Hatalar varsa formu gönderme
    }
  
    // CreateTyt objesini oluştur
    const tytUpdate: UpdateTyt = {
      tytId:id as string,
      matematikDogru: scores.Matematik.correct,
      matematikYanlis: scores.Matematik.incorrect,
      turkceDogru: scores.Türkçe.correct,
      turkceYanlis: scores.Türkçe.incorrect,
      fenDogru: scores.Fen.correct,
      fenYanlis: scores.Fen.incorrect,
      sosyalDogru: scores.Sosyal.correct,
      sosyalYanlis: scores.Sosyal.incorrect,
      yanlisKonular: [],
      bosKonular: [],
    };
    try {
      await denemeService.editTyt(tytUpdate,()=>{},()=>{
        toast({
          title: 'Başarısız',
          description: `TYT denemesi güncellenirken bir hata oluştu.`,
          variant: "destructive",
        });
      });
    } catch (error: any) {
      
    }
  }; 

  const fetchTyt = async () => {
    if (!id) return;
    const fetchedTyt = await denemeService.getTytById(id as string);
    setTyt(fetchedTyt);
    if (fetchedTyt) {
      setScores({
          Türkçe: { correct: fetchedTyt.turkceDogru, incorrect: fetchedTyt.turkceYanlis },
          Matematik: { correct: fetchedTyt.matematikDogru, incorrect: fetchedTyt.matematikYanlis },
          Fen: { correct: fetchedTyt.fenDogru, incorrect: fetchedTyt.fenYanlis },
          Sosyal: { correct: fetchedTyt.sosyalDogru, incorrect: fetchedTyt.sosyalYanlis },
      });
  }
  };
  useEffect(() => {
    fetchTyt();
    const userId = authService.userId as string; 
    signalRService.start(HubUrls.TytHub,userId);
    signalRService.on(HubUrls.TytHub, ReceiveFunctions.TytUpdatedMessage, async (message) => {
        await fetchTyt(); 
        toast({
          title: 'Başarılı',
          description: 'TYT denemesi başarıyla güncellendi.',
        });
    }, userId);
    return () => {
        signalRService.off(HubUrls.TytHub, ReceiveFunctions.TytUpdatedMessage, userId);
    };
  }, [id, signalRService]);

  if (!tyt) return <div className="text-center mt-2">TYT denemesi bulunamadı.</div>;
  return (
    <div className="flex flex-col items-center">
      <form onSubmit={handleSubmit} className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mt-4"> {/* Responsive grid layout */}
          {subjects.map((subject) => (
            <div key={subject} className="flex flex-col items-start"> {/* Use items-start for better alignment */}
              <h3 className="text-lg font-semibold">{subject}</h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Label htmlFor={`${subject}-true`}>Doğru</Label>
                  <Input
                    type="number"
                    id={`${subject}-true`}
                    placeholder="Doğru"
                    className="w-24"
                    value={scores[subject].correct === 0 ? '0' : scores[subject].correct || ''} // Show '0' if correct is 0
                    onChange={(e) => handleScoreChange(subject, 'correct', e.target.value)}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Label htmlFor={`${subject}-false`}>Yanlış</Label>
                  <Input
                    type="number"
                    id={`${subject}-false`}
                    placeholder="Yanlış"
                    className="w-24"
                    value={scores[subject].incorrect === 0 ? '0' : scores[subject].incorrect || ''} // Show '0' if incorrect is 0
                    onChange={(e) => handleScoreChange(subject, 'incorrect', e.target.value)}
                  />
                </div>
              </div>
              {/* Hata mesajları */}
              {errors[subject].length > 0 && (
                <div className="text-red-500 mt-2">
                  {errors[subject].map((error, index) => (
                    <p key={index}>{error}</p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-end mt-4">
        <AlertDialog open={isDialogOpen} onOpenChange={setDialogOpen}>
            <AlertDialogTrigger asChild>
                <Button className="ml-auto" onClick={handleUpdateClick}>Güncelle</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Güncelleme Onayı</AlertDialogTitle>
                    <AlertDialogDescription>
                        Güncellemek istediğinize emin misiniz?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <Button variant="outline" onClick={() => setDialogOpen(false)}>
                        İptal
                    </Button>
                    <Button 
                        onClick={() => {
                            setDialogOpen(false);
                            handleSubmit(); // Formu gönder
                        }}
                    >
                        Evet
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
        </div>
      </form>
    </div>
  );
};

export default SingleTytContent;
