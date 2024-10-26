"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { z } from "zod"; // Zod'u import ettik
import { derslerService } from "@/app/services/dersler.service";
import { Ders, UpdateDers } from "@/types";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useSignalR } from "@/hooks/use-signalr";
import { HubUrls } from "@/types/hubUrls";
import { ReceiveFunctions } from "@/types/receiveFunctions";

// Zod şeması tanımlama
const dersSchema = z.object({
  dersAdi: z.string().min(1, "Ders adı boş olamaz."), // Ders adı boş olamaz
  isTyt: z.boolean(),
});

const SingleDersContent = () => {
  const { id } = useParams();
  const [ders, setDers] = useState<Ders | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isTyt1, setIsTyt1] = useState<boolean>(false);
  const [inputError, setInputError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null); // Submit hatası için durum
  const signalRService = useSignalR();

  // fetchDers fonksiyonunu burada tanımlıyoruz
  const fetchDers = async () => {
    if (!id) return;
    try {
      const fetchedDers = await derslerService.getDersById(id as string);
      setDers(fetchedDers);
      setIsTyt1(fetchedDers.isTyt);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Bilinmeyen bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDers(); // Başlangıçta dersleri getir

    signalRService.on(HubUrls.DersHub, ReceiveFunctions.DersUpdatedMessage, async (message) => {
      fetchDers(); // Güncelleme mesajı alındığında dersleri tekrar getir
    });

    return () => {
      signalRService.off(HubUrls.DersHub, ReceiveFunctions.DersUpdatedMessage); // Cleanup
    };
  }, [id, signalRService]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Eğer değer boşlukla başlıyorsa veya özel karakter içeriyorsa, inputu güncellemiyoruz
    if (value.startsWith(" ") || /[^a-zA-Z0-9ğüşıöçĞÜŞİÖÇ\s]/.test(value)) {
      return; // Hiçbir şey yapma
    }

    setInputError(null); // Giriş geçerli hale geldiğinde hata mesajını sıfırlıyoruz
    setDers(ders ? { ...ders, dersAdi: value } : null);
  };

  const handleCheckboxChange = (isTyt: boolean) => {
    setIsTyt1(isTyt);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Zod ile ders verilerini doğruluyoruz
      dersSchema.parse({
        dersAdi: ders?.dersAdi ?? "",
        isTyt: isTyt1,
      });

      // Güncelleme için UpdateDers nesnesini oluştur
      const updateDers = new UpdateDers();
      updateDers.dersId = id as string; // dersId'yi ayarlıyoruz
      updateDers.dersAdi = ders?.dersAdi ?? "";
      updateDers.isTyt = isTyt1;

      await derslerService.editDers(updateDers, 
        () => {
        },
        (errorMessage) => {
          toast({
            title: 'Başarısız',
            description: 'Ders güncellenirken bir hata oluştu.',
            variant: 'destructive',
          });
        }
      );

    } catch (err) {
      if (err instanceof z.ZodError) {
        setInputError(err.errors[0].message); // İlk hatayı göster
      }
    }
  };

  if (!ders) return <div className="text-center mt-2">Ders bulunamadı.</div>;

  return (
    <div className="p-4 mx-auto max-w-7xl">
      <form className="flex flex-col" onSubmit={handleSubmit}>
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-8/12">
            <Label htmlFor="dersAdi" className="block mb-2">
              Ders Adı
            </Label>
            <Input
              id="dersAdi"
              value={ders.dersAdi}
              onChange={handleInputChange}
              className="w-full"
            />
            {inputError && <p className="text-red-500 mt-1">{inputError}</p>}
          </div>

          <div className="flex items-center justify-center w-4/12 space-x-4">
            <div className="flex items-center">
              <Checkbox
                id="tytCheckbox"
                checked={isTyt1}
                onChange={() => handleCheckboxChange(true)}
                onClick={() => handleCheckboxChange(true)}
                className="mr-2 cursor-pointer"
              />
              <Label
                htmlFor="tytCheckbox"
                className="cursor-pointer"
                onClick={() => handleCheckboxChange(true)}
              >
                TYT
              </Label>
            </div>

            <div className="flex items-center">
              <Checkbox
                id="aytCheckbox"
                checked={!isTyt1}
                onChange={() => handleCheckboxChange(false)}
                onClick={() => handleCheckboxChange(false)}
                className="mr-2 cursor-pointer"
              />
              <Label
                htmlFor="aytCheckbox"
                className="cursor-pointer"
                onClick={() => handleCheckboxChange(false)}
              >
                AYT
              </Label>
            </div>
          </div>
        </div>

        {submitError && <p className="text-red-500">{submitError}</p>} {/* Hata mesajı için */}
        
        <Button type="submit">Güncelle</Button>
      </form>
    </div>
  );
};

export default SingleDersContent;
