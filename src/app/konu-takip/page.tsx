// pages/giris-yap.tsx
import KonuTakipContent from "@/components/konu-takip/konuTakipContent";
import { LoginForm } from "@/components/login";
import { RegisterForm } from "@/components/register";
import React from "react";

export default function KonuTakip(){
  return (
    <div className="max-w-7xl mx-auto ">
      <KonuTakipContent></KonuTakipContent>
    </div>
  );
};

