"use client";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./styles/globals.css";
import { Plus_Jakarta_Sans as FontJakarta, Plus_Jakarta_Sans } from "next/font/google";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { ThemeProvider } from "next-themes";
import Navigation from "@/components/navigation";
import { dashboardConfig } from "@/config/dashboard";
import { Toaster } from "@/components/ui/toaster";
import { useSignalR } from "@/hooks/use-signalr";
import { toast } from "@/hooks/use-toast";
import { HubUrls } from "@/types/hubUrls";
import { ReceiveFunctions } from "@/types/receiveFunctions";
import { useEffect } from "react";
import { metadata } from "./metadata";
import authService from "./services/auth.service";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], display: "swap" }); 
const fontJakartaSans = FontJakarta({ subsets: ["latin"], variable: "--font-jakarta-sans", });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const signalRService = useSignalR();
  const isAdmin=authService.isAdmin;
  if(isAdmin){
    useEffect(() => {
      signalRService.on(
        HubUrls.KonuHub,
        ReceiveFunctions.KonuDeletedMessage,
        async (message) => {
          const newMessage = message;
          const messageLines = newMessage.split("\n");
          toast({
            title: "Admin Bilgilendirmesi",
            description: (
              <>
                {messageLines.map((line: any, index: any) => (
                  <div key={index}>{line}</div>
                ))}
              </>
            ),
            variant: "destructive",
          });
        }
      );
      signalRService.on(
        HubUrls.KonuHub,
        ReceiveFunctions.KonuAddedMessage,
        async (message) => {
          const newMessage = message;
          const messageLines = newMessage.split("\n");
          toast({
            title: "Admin Bilgilendirmesi",
            description: (
              <>
                {messageLines.map((line: any, index: any) => (
                  <div key={index}>{line}</div>
                ))}
              </>
            ),
          });
        }
      );
      signalRService.on(
        HubUrls.KonuHub,
        ReceiveFunctions.KonuUpdatedMessage,
        async (message) => {
          const newMessage = message;
          const messageLines = newMessage.split("\n");
          toast({
            title: "Admin Bilgilendirmesi",
            description: (
              <>
                {messageLines.map((line: any, index: any) => (
                  <div key={index}>{line}</div> // Her bir satırı ayrı bir div içinde render ediyoruz
                ))}
              </>
            ),
          });
        }
      );
      signalRService.on(
        HubUrls.DersHub,
        ReceiveFunctions.DersDeletedMessage,
        async (message) => {
          const newMessage = message;
          const messageLines = newMessage.split("\n");
          toast({
            title: "Admin Bilgilendirmesi",
            description: (
              <>
                {messageLines.map((line: any, index: any) => (
                  <div key={index}>{line}</div>
                ))}
              </>
            ),
            variant: "destructive",
          });
        }
      );
      signalRService.on(
        HubUrls.DersHub,
        ReceiveFunctions.DersAddedMessage,
        async (message) => {
          const newMessage = message;
          const messageLines = newMessage.split("\n");
          toast({
            title: "Admin Bilgilendirmesi",
            description: (
              <>
                {messageLines.map((line: any, index: any) => (
                  <div key={index}>{line}</div>
                ))}
              </>
            ),
          });
        }
      );
      signalRService.on(
        HubUrls.DersHub,
        ReceiveFunctions.DersUpdatedMessage,
        async (message) => {
          const newMessage = message;
          const messageLines = newMessage.split("\n");
          toast({
            title: "Admin Bilgilendirmesi",
            description: (
              <>
                {messageLines.map((line: any, index: any) => (
                  <div key={index}>{line}</div> // Her bir satırı ayrı bir div içinde render ediyoruz
                ))}
              </>
            ),
          });
        }
      );

      return () => {
        signalRService.off(HubUrls.KonuHub, ReceiveFunctions.KonuDeletedMessage);
        signalRService.off(HubUrls.KonuHub, ReceiveFunctions.KonuAddedMessage);
        signalRService.off(HubUrls.KonuHub, ReceiveFunctions.KonuUpdatedMessage);
        signalRService.off(HubUrls.DersHub, ReceiveFunctions.DersDeletedMessage);
        signalRService.off(HubUrls.DersHub, ReceiveFunctions.DersAddedMessage);
        signalRService.off(HubUrls.DersHub, ReceiveFunctions.DersUpdatedMessage);
      };
    }, [signalRService]);
  }
  
  return (
    <html lang="en">
       <head>
          <title>{metadata.title}</title>
          <meta name="description" content={metadata.description || "Deneme takip"} />
        {/* You can add more meta tags here if needed */}
      </head>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      >
        <body
          className={`${jakarta.className} ${fontJakartaSans.variable} antialiased min-h-screen mx-auto`}
        >
          <Toaster />
          <div className="min-h-screen w-full">
            <header className="sticky justify-center items-center flex flex-col w-full top-0 z-40 bg-background">
              <div className="flex h-16 items-center w-full mx-auto justify-between py-4">
                <Navigation items={dashboardConfig.mainNav} />
              </div>
              <div className="border-b h-2 w-screen mx-0 flex justify-center items-center"></div>
            </header>
            <main>{children}</main>
            <footer className="flex flex-col h-16 items-center w-full mx-auto justify-between py-4">
            </footer>
          </div>
        </body>
      </ThemeProvider>
    </html>
  );
}
