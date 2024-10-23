"use client";

import { denemeService } from '@/app/services/denemeler.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreateTyt } from '@/types';
import React, { useState } from 'react';
import { z } from 'zod';
import { toast } from '@/hooks/use-toast';

// Zod Schema Tanımları
const subjectSchema = z.object({
  correct: z.number().min(0).max(40),
  incorrect: z.number().min(0).max(40),
}).refine(data => data.correct + data.incorrect <= 40, {
  message: "Toplam puan 40'ı geçemez",
});

// Dersler
const subjects = ['Türkçe', 'Matematik', 'Fen', 'Sosyal'] as const;

// Skorların tipi
type ScoreType = {
  correct: number;
  incorrect: number;
};

// Skorlar durumunun tipi
type ScoresType = {
  [key in typeof subjects[number]]: ScoreType;
};

// Maksimum limitlerin tipi
type MaxLimitsType = {
  [key in typeof subjects[number]]: {
    correct: number;
    incorrect: number;
    total: number;
  };
};

const TytCreate = () => {
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

    // Hata kontrolü
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

    setErrors(newErrors); // Hata mesajlarını ayarla
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
    const tytDeneme: CreateTyt = {
      matematikDogru: scores.Matematik.correct,
      matematikYanlis: scores.Matematik.incorrect,
      turkceDogru: scores.Türkçe.correct,
      turkceYanlis: scores.Türkçe.incorrect,
      fenDogru: scores.Fen.correct,
      fenYanlis: scores.Fen.incorrect,
      sosyalDogru: scores.Sosyal.correct,
      sosyalYanlis: scores.Sosyal.incorrect,
      yanlisKonularId: [],
      bosKonularId: [],
    };
  
    try {
      await denemeService.createTyt(tytDeneme);
      // Başarı mesajını toast ile göster
      toast({
        title: 'Başarılı',
        description: 'Deneme başarıyla eklendi!',
      });
    } catch (error: any) {
      toast({
        title: 'Başarısız',
        description: `Tyt denemesi eklenirken bir hata oluştu.`,
        variant: "destructive",
      });
    }
  };
  

  return (
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
        <Button className="ml-auto" type="submit">Deneme Ekle</Button>
      </div>
    </form>
  );
};

export default TytCreate;
