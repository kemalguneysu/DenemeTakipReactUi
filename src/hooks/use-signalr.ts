// hooks/use-signalr.ts
import { SignalRService } from '@/app/services/signalr.service';
import { useRef } from 'react';

export function useSignalR() {
  const serviceRef = useRef<SignalRService | null>(null);

  if (!serviceRef.current) {
    const baseSignalRUrl = process.env.NEXT_PUBLIC_API_SignalRURL!;
    serviceRef.current = new SignalRService(baseSignalRUrl);
  }

  return serviceRef.current; // Service'i döndür
}
