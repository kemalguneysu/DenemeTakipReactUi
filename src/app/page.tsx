"use client";
import FAQSection from "@/components/faq";
import FeaturesSection from "@/components/features";
import { useSignalR } from "@/hooks/use-signalr";
import { toast } from "@/hooks/use-toast";
import { HubUrls } from "@/types/hubUrls";
import { ReceiveFunctions } from "@/types/receiveFunctions";
import { useEffect } from "react";
import authService from "./services/auth.service";
import HomePage from "@/components/homepage/homePage";


export default function Home() { 
  var isAuthenticated = authService.isAuthenticated;

  return (
    <div className="max-w-7xl mx-auto">
      {!isAuthenticated ? ( // Kullanıcı oturum açmamışsa gösterilecek içerik
        <div >
          <FeaturesSection />
          <div className="max-w-4xl mx-auto py-8">
            <FAQSection />
          </div>
        </div>
      ) : (    
        <div>
          <HomePage/>
        </div>
      )}
    </div>
  );
}
