"use client";

import { denemeService } from '@/app/services/denemeler.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreateAyt } from '@/types';
import React, { useState } from 'react';
import { toast } from '@/hooks/use-toast';

// Skorların tipi
type ScoreType = {
  correct: number;
  incorrect: number;
};

// Dersler
const subjects = [
  'Matematik', 'Fizik', 'Kimya', 'Biyoloji', 
  'Edebiyat', 'Tarih 1', 'Coğrafya 1', 
  'Tarih 2', 'Coğrafya 2', 'Felsefe', 
  'Din', 'Dil'
] as const;

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

const AytCreate = () => {
  const [scores, setScores] = useState<ScoresType>(
    subjects.reduce((acc, subject) => {
      acc[subject] = { correct: 0, incorrect: 0 };
      return acc;
    }, {} as ScoresType)
  );

  const maxLimits: MaxLimitsType = {
    Matematik: { correct: 40, incorrect: 40, total: 40 },
    Fizik: { correct: 14, incorrect: 14, total: 14 },
    Kimya: { correct: 13, incorrect: 13, total: 13 },
    Biyoloji: { correct: 13, incorrect: 13, total: 13 },
    Edebiyat: { correct: 24, incorrect: 24, total: 24 },
    "Tarih 1": { correct: 10, incorrect: 10, total: 10 },
    "Coğrafya 1": { correct: 6, incorrect: 6, total: 6 },
    "Tarih 2": { correct: 11, incorrect: 11, total: 11 },
    "Coğrafya 2": { correct: 11, incorrect: 11, total: 11 },
    Felsefe: { correct: 12, incorrect: 12, total: 12 },
    Din: { correct: 6, incorrect: 6, total: 6 },
    Dil: { correct: 80, incorrect: 80, total: 80 },
  };

  const [errorMessages, setErrorMessages] = useState<{ [key in typeof subjects[number]]: string | null }>(
    subjects.reduce((acc, subject) => {
      acc[subject] = null;
      return acc;
    }, {} as { [key in typeof subjects[number]]: string | null })
  );

  const handleScoreChange = (subject: typeof subjects[number], type: 'correct' | 'incorrect', value: string) => {
    const numberValue = Number(value);
    const newScores = { ...scores, [subject]: { ...scores[subject], [type]: isNaN(numberValue) ? 0 : numberValue } };
    setScores(newScores);

    // Validation
    const total = newScores[subject].correct + newScores[subject].incorrect;
    let errorMessage = '';

    // Check correct answers
    if (newScores[subject].correct < 0 || newScores[subject].correct > maxLimits[subject].correct) {
      errorMessage = `${subject} doğru 0 ile ${maxLimits[subject].correct} arasında olmalıdır.`;
    } else if (newScores[subject].incorrect < 0 || newScores[subject].incorrect > maxLimits[subject].incorrect) {
      // Check incorrect answers only if correct answers are valid
      errorMessage = `${subject} yanlış 0 ile ${maxLimits[subject].incorrect} arasında olmalıdır.`;
    } else if (total > maxLimits[subject].total) {
      // Check total only if correct and incorrect answers are valid
      errorMessage = `${subject} alanı için toplam ${maxLimits[subject].total} soru girilmelidir.`;
    }

    // Update error messages state: Show only one error per subject
    setErrorMessages((prev) => ({
      ...prev,
      [subject]: errorMessage || null, // Clear the error message if there's no error
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check for any errors before submission
    for (const subject of subjects) {
      if (errorMessages[subject]) {
        toast({
          title: 'Hata',
          description: errorMessages[subject],
          variant: "destructive",
        });
        return;
      }
    }

    // CreateAyt objesini oluştur
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
      tarih1Dogru: scores["Tarih 1"].correct,
      tarih1Yanlis: scores["Tarih 1"].incorrect,
      cografya1Dogru: scores["Coğrafya 1"].correct,
      cografya1Yanlis: scores["Coğrafya 1"].incorrect,
      tarih2Dogru: scores["Tarih 2"].correct,
      tarih2Yanlis: scores["Tarih 2"].incorrect,
      cografya2Dogru: scores["Coğrafya 2"].correct,
      cografya2Yanlis: scores["Coğrafya 2"].incorrect,
      felsefeDogru: scores.Felsefe.correct,
      felsefeYanlis: scores.Felsefe.incorrect,
      dinDogru: scores.Din.correct,
      dinYanlis: scores.Din.incorrect,
      dilDogru: scores.Dil.correct,
      dilYanlis: scores.Dil.incorrect,
      yanlisKonularId: [],
      bosKonularId: [],
    };

    try {
      await denemeService.createAyt(aytDeneme);
      // Başarı mesajını toast ile göster
      toast({
        title: 'Başarılı',
        description: 'Deneme başarıyla eklendi!',
      });
    } catch (error: any) {
      toast({
        title: 'Başarısız',
        description: `Ayt denemesi eklenirken bir hata oluştu.`,
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
        {subjects.map((subject) => (
          <div key={subject} className="flex flex-col items-start">
            <h3 className="text-lg font-semibold">{subject}</h3>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Label htmlFor={`${subject}-true`}>Doğru</Label>
                <Input
                  type="number"
                  id={`${subject}-true`}
                  placeholder="Doğru"
                  className="w-24"
                  value={scores[subject].correct === 0 ? '0' : scores[subject].correct || ''}
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
                  value={scores[subject].incorrect === 0 ? '0' : scores[subject].incorrect || ''}
                  onChange={(e) => handleScoreChange(subject, 'incorrect', e.target.value)}
                />
              </div>
            </div>
            {errorMessages[subject] && (
              <div className="mt-2">
                <span className="text-red-500 text-sm">{errorMessages[subject]}</span>
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

export default AytCreate;
