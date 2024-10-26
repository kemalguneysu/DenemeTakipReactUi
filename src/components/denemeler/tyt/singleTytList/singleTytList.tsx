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

  const fetchTyt = async () => {
    if (!id) return;
    const fetchedTyt = await denemeService.getTytById(id as string);
    setTyt(fetchedTyt);

  };
  useEffect(() => {
    fetchTyt();
    const userId = authService.userId as string; 
    signalRService.start(HubUrls.TytHub,userId);
    signalRService.on(HubUrls.TytHub, ReceiveFunctions.TytUpdatedMessage, async (message) => {
        await fetchTyt(); 
    }, userId);
    return () => {
        signalRService.off(HubUrls.TytHub, ReceiveFunctions.TytUpdatedMessage, userId);
    };
  }, [id, signalRService]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updateTyt = new UpdateTyt();

      await denemeService.editTyt(updateTyt, 
          () => {
          },
          (errorMessage) => {
            toast({
                title: 'Başarısız',
                description: 'TYT denemesi güncellenirken bir hata oluştu.',
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

  if (!tyt) return <div className="text-center mt-2">Konu bulunamadı.</div>;
  return (
    <div className="p-4 mx-auto max-w-7xl">
      
    </div>
  );
};

export default SingleTytContent;
