import Navigation from "@/components/navigation";
import React, { useEffect } from "react";
import { dashboardConfig } from "../../config/dashboard"
import { useSignalR } from "@/hooks/use-signalr";
import { toast } from "@/hooks/use-toast";
import { HubUrls } from "@/types/hubUrls";
import { ReceiveFunctions } from "@/types/receiveFunctions";

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {

  return (
    <div className="min-h-screen w-full ">
      <header className="sticky justify-center items-center flex flex-col w-full top-0 z-40 bg-background">
        <div className=" flex h-16 items-center w-full mx-auto justify-between py-4">
          <Navigation items={dashboardConfig.mainNav} />
        </div>
        <div className="border-b h-2 w-screen mx-0 flex justify-center items-center"></div>
      </header>

      <main>{children}</main>
      <div className="flex flex-col h-16 items-center w-full mx-auto justify-between py-4">
        <div className="border-b h-2 w-screen mx-0 flex justify-center items-center"></div>

      </div>
    </div>
  );
}