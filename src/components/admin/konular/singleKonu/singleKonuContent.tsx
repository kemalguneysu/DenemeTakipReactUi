"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { z } from "zod"; 
import { derslerService } from "@/app/services/dersler.service";
import { Ders, Konu, ListKonu, UpdateKonu } from "@/types";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useSignalR } from "@/hooks/use-signalr";
import { HubUrls } from "@/types/hubUrls";
import { ReceiveFunctions } from "@/types/receiveFunctions";
import { konularService } from "@/app/services/konular.service";
import CustomToggleDersler from "@/app/admin/dersler/custom.toggle.dersler";
import { ComboboxDemo } from "../konuCreate/konuCreate.combobox";

// Zod schema
const dersSchema = z.object({
  dersAdi: z.string().min(1, "Ders adı boş olamaz."),
  isTyt: z.boolean(),
});

const SingleDersContent = () => {
  const { id } = useParams();
  const [konu, setKonu] = useState<ListKonu | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [inputError, setInputError] = useState<string | null>(null);
  const signalRService = useSignalR();
  const [isTyt, setIsTyt] = useState<boolean>(true);
  const [dersler, setDersler] = useState<Ders[]>([]);
  const [selectedDersId, setSelectedDersId] = useState<string>('');
  const [konuAdi, setKonuAdi] = useState<string>('');

  const fetchKonu = async () => {
    if (!id) return;
    try {
      const fetchedKonu = await konularService.getKonuById(id as string);
      setKonu(fetchedKonu);
      setSelectedDersId(fetchedKonu.dersId);
      setIsTyt(fetchedKonu.isTyt);
      setKonuAdi(fetchedKonu.konuAdi);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Bilinmeyen bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchDersler = async () => {
      try {
        const response = await derslerService.getAllDers(isTyt);
        setDersler(response.dersler);
      } catch (error) {
        toast({
          title: 'Hata',
          description: 'Dersler alınırken bir hata oluştu.',
          variant: 'destructive',
        });
      }
    };
    if(isTyt!=konu?.isTyt)
        setSelectedDersId('');
    else if(isTyt==konu?.isTyt)
        setSelectedDersId(konu?.dersId as string);
    fetchDersler();
  }, [isTyt]);

  useEffect(() => {
    fetchKonu();
    signalRService.on(HubUrls.KonuHub, ReceiveFunctions.KonuUpdatedMessage, async (message) => {
        fetchKonu();
    });
    return () => {
      signalRService.off(HubUrls.KonuHub, ReceiveFunctions.KonuUpdatedMessage);
    };
  }, [id, signalRService]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value.startsWith(" ") || /[^a-zA-Z0-9ğüşıöçĞÜŞİÖÇ\s]/.test(value)) {
      return;
    }
    setKonuAdi(value);
    setInputError(null); 
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updateKonu = new UpdateKonu();
      updateKonu.konuId=id as string;
      updateKonu.konuAdi = konuAdi;
      updateKonu.dersId = selectedDersId; // Use selectedDersId for submission

      await konularService.editKonu(updateKonu, 
          () => {
            // toast({
            //     title: 'Başarılı',
            //     description: 'Ders başarıyla güncellendi.',
            // });
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
        setInputError(err.errors[0].message);
      }
    }
  };

  if (loading) return <div className="text-center mt-2">Yükleniyor...</div>;
  if (!konu) return <div className="text-center mt-2">Konu bulunamadı.</div>;

  return (
    <div className="p-4 mx-auto max-w-7xl">
      <form className="flex flex-col" onSubmit={handleSubmit}>
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-full">
            <Label htmlFor="dersAdi" className="block mb-2">
              Konu Adı
            </Label>
            <Input
              id="dersAdi"
              value={konuAdi}
              onChange={handleInputChange}
              className="w-full"
            />
            {inputError && <p className="text-red-500 mt-1">{inputError}</p>}
          </div>
        </div>
        <div className="mb-4">
          <CustomToggleDersler 
            onChange={(value: any) => setIsTyt(value)} 
            isTyt={isTyt} // Pass the current isTyt value to toggle
          />
        </div>
        <div className="mb-4">
          <ComboboxDemo 
            items={dersler}
            onSelect={(value: string) => setSelectedDersId(value)} 
            value={selectedDersId} // Bind the selectedDersId to the Combobox
          />
        </div>
        <Button type="submit" className="w-full"> 
          Güncelle
        </Button>
      </form>
    </div>
  );
};

export default SingleDersContent;
