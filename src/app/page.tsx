"use client";
import FAQSection from "@/components/faq";
import FeaturesSection from "@/components/features";
import { useSignalR } from "@/hooks/use-signalr";
import { toast } from "@/hooks/use-toast";
import { HubUrls } from "@/types/hubUrls";
import { ReceiveFunctions } from "@/types/receiveFunctions";
import { useEffect } from "react";


export default function Home() { 
  return (
    <div className="min-h-screen  max-w-7xl mx-auto ">
      <FeaturesSection />
      <div className="max-w-4xl mx-auto py-8">
        <FAQSection />
      </div>
    </div>
  );
}
