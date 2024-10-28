"use client"; // Client component

import React, { useState } from 'react';
import { Input } from '@/components/ui/input'; // Shadcn UI input bileşeni
import { Button } from '@/components/ui/button'; // Shadcn UI button bileşeni
import { CreateDers } from "@/types"; // CreateDers arayüzünü import et
import { derslerService } from '@/app/services/dersler.service';
import CustomToggleDersler from '@/app/admin/dersler/custom.toggle.dersler';
import { z } from 'zod'; // Zod'u import et
import { toast } from '@/hooks/use-toast';

// Zod ile validation şeması
const dersSchema = z.object({
  dersAdi: z.string().min(1, "Ders adı boş olamaz."), // Ders adı boş olmamalı
  isTyt: z.boolean(),
});

const DersCreate = () => {
  const [inputValue, setInputValue] = useState(''); // Input değerini tutmak için state
  const [isTyt, setIsTyt] = useState<boolean>(true); // Varsayılan olarak TYT seçili
  const [errors, setErrors] = useState<string | null>(null); // Hata mesajlarını tutmak için state

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Eğer değer boşluk ile başlıyorsa veya özel karakter içeriyorsa, inputu güncellemiyoruz
    if (value.startsWith(' ') || /[^a-zA-Z0-9ğüşıöçĞÜŞİÖÇ\s]/.test(value)) {
      return; // Hiçbir şey yapma
    }

    setInputValue(value);

    // Hata varsa ve input geçerli hale gelirse hatayı sıfırla
    if (value.trim() !== '') {
      setErrors(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Formun varsayılan davranışını engelle

    // CreateDers objesini oluştur
    const ders: CreateDers = {
      dersAdi: inputValue,
      isTyt: isTyt,
    };

    // Ders objesini doğrula
    const validation = dersSchema.safeParse(ders);

    if (!validation.success) {
      // Eğer doğrulama başarısızsa, hatayı set et
      setErrors(validation.error.errors[0].message);
      return;
    }

    setErrors(null);

    try {
      // Ders oluşturma işlemi
      const response = await derslerService.createDers(ders);
      // Input alanını temizle
      setInputValue(''); 
    } catch (error: any) {
      toast({
        title: 'Başarısız',
        description: 'Ders eklenirken bir hata oluştu.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="py-4 max-w-7xl mx-auto"> {/* Ortalanmış bir genişlik */} 
      <form onSubmit={handleSubmit}>
        {/* Input alanı */}
        <div className="mb-4">
          <Input 
            type="text" 
            value={inputValue} 
            onChange={handleInputChange}  // Input değiştiğinde çağrılacak fonksiyon
            placeholder="Ders adı girin" 
            className="w-full"
          />
          {errors && <p className="text-red-500 text-sm mt-1">{errors}</p>} {/* Hata mesajı */}
        </div>

        {/* Toggle butonu */}
        <div className="mb-4">
          <CustomToggleDersler onChange={(value: any) => setIsTyt(value)} /> {/* Toggle'dan gelen değeri ayarlayın */}
        </div>

        {/* Gönder butonu */}
        <Button type="submit" className="w-full"> 
          Ders Ekle
        </Button>
      </form>
    </div>
  );
};

export default DersCreate;
