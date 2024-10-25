"use client";

import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input'; // Shadcn UI input component
import { Button } from '@/components/ui/button'; // Shadcn UI button component
import { CreateKonu } from "@/types"; // CreateKonu interface
import { z } from 'zod'; // Import Zod for validation
import { toast } from '@/hooks/use-toast';
import CustomToggleDersler from '@/app/admin/dersler/custom.toggle.dersler';
import { konularService } from '@/app/services/konular.service';
import { Ders } from '@/types'; // Import Ders type
import { derslerService } from '@/app/services/dersler.service';
import { ComboboxDemo } from './konuCreate.combobox';

// Zod validation schema for topics
const konuSchema = z.object({
  konuAdi: z.string().min(1, "Konu adı boş olamaz.").regex(/^[a-zA-Z0-9ğüşıöçĞÜŞİÖÇ\s]*$/, "Konu adı özel karakter içeremez."),
  dersId: z.string().min(1, "Ders seçimi yapmalısınız."), // Ensure dersId is present
  isTyt: z.boolean(),
});

const KonuCreate = () => {
  const [inputValue, setInputValue] = useState(''); // Input state
  const [isTyt, setIsTyt] = useState<boolean>(true); // Default is TYT
  const [errors, setErrors] = useState<string | null>(null); // State for errors
  const [selectedDersId, setSelectedDersId] = useState<string>(''); // Ders ID state
  const [dersler, setDersler] = useState<Ders[]>([]); // State for Dersler

  useEffect(() => {
    // Fetch all Dersler when the component mounts
    const fetchDersler = async () => {
      try {
        const response = await derslerService.getAllDers(isTyt);
        setDersler(response.dersler); // Store the fetched Dersler
      } catch (error) {
        toast({
          title: 'Hata',
          description: 'Dersler alınırken bir hata oluştu.',
          variant: 'destructive',
        });
      }
    };
    setSelectedDersId('');
    fetchDersler();
  }, [isTyt]); // Rerun when isTyt changes

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
    e.preventDefault(); // Prevent default form behavior

    // CreateKonu object
    const konu: CreateKonu = {
      konuAdi: inputValue,
      dersId: selectedDersId, // Ensure a dersId is selected
      isTyt: isTyt,
    };

    // Validate the object using Zod
    const validation = konuSchema.safeParse(konu);

    if (!validation.success) {
      // If validation fails, set the error
      setErrors(validation.error.errors[0].message);
      return;
    }

    setErrors(null);

    try {
      // Call the service to create a topic
      await konularService.createKonu(konu);
      toast({
        title: 'Başarılı',
        description: 'Konu başarıyla eklendi!',
      });

      setInputValue(''); // Clear input
      setSelectedDersId(''); // Reset ders selection
    } catch (error: any) {
      toast({
        title: 'Başarısız',
        description: 'Konu eklenirken bir hata oluştu.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="p-4 max-w-7xl mx-auto"> {/* Centered width */} 
      <form onSubmit={handleSubmit}>
        {/* Input field */}
        <div className="mb-4">
          <Input 
            type="text" 
            value={inputValue} 
            onChange={handleInputChange}  // Called on input change
            placeholder="Konu adı girin" 
            className="w-full"
          />
          {errors && <p className="text-red-500 text-sm mt-1">{errors}</p>} {/* Error message */}
        </div>
        
        <div className="mb-4">
          <CustomToggleDersler onChange={(value: any) => setIsTyt(value)} /> {/* Set value from toggle */} 
        </div>

        <div className="mb-4">
          <ComboboxDemo 
              items={dersler} // Pass the fetched dersler to the Combobox
              onSelect={(value: string) => setSelectedDersId(value)} // Update selected Ders ID
              value={selectedDersId} // Pass the selectedDersId as value
          />
        </div>

        {/* Submit button */}
        <Button type="submit" className="w-full"> 
          Konu Ekle
        </Button>
      </form>
    </div>
  );
};

export default KonuCreate;
