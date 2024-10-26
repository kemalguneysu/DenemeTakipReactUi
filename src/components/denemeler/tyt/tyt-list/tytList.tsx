"use client";

import { useEffect, useState } from "react";
import { Ders, tytGenelList, TytSingleList } from "@/types";
import { derslerService } from "@/app/services/dersler.service";
import { useSignalR } from "@/hooks/use-signalr";
import { ReceiveFunctions } from "@/types/receiveFunctions";
import { HubUrls } from "@/types/hubUrls";
import { denemeService } from "@/app/services/denemeler.service";
import { DataTable } from "./tytList-dataTable";
import { columns } from "./tytList-columns";
import authService from "@/app/services/auth.service";
import { HubConnectionBuilder } from "@microsoft/signalr";
import { toast } from "@/hooks/use-toast";

export default function DersList() {
  const [data, setData] = useState<tytGenelList[]>([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [isTyt, setIsTyt] = useState<boolean | null>(null); // Default to null
  const [input, setInput] = useState<string>("");
  const [totalCount, setTotalCount] = useState(0);
  const signalRService = useSignalR();

  // fetchData fonksiyonunu burada tanımlıyoruz
  const fetchData = async () => {
      try {
          const result = await denemeService.getTytDenemes(
            page + 1,
            pageSize,
            [],
            () => {},
            () => {},
          );
          setData(result.tytDenemes);
          const totalCount = result.totalCount;
          setTotalCount(totalCount); 
          const newTotalPages = Math.ceil(totalCount / pageSize);
          setTotalPages(newTotalPages);
      } catch (error) {
      }
  };

  useEffect(() => {
      fetchData();
  }, [page, pageSize, input, isTyt]);


  useEffect(() => {
    const userId = authService.userId as string; 
    signalRService.start(HubUrls.TytHub,userId);
    signalRService.on(HubUrls.TytHub, ReceiveFunctions.TytAddedMessage, async (message) => {
        await fetchData(); 
        toast({
            title: 'Başarılı',
            description: message
          });
    }, userId);

    signalRService.on(HubUrls.TytHub, ReceiveFunctions.TytDeletedMessage, async (message) => {
        await fetchData();
        toast({
            title: 'Başarılı',
            description: message
          });
    }, userId);
    
    signalRService.on(HubUrls.TytHub, ReceiveFunctions.TytUpdatedMessage, async (message) => {
        await fetchData();
        toast({
            title: 'Başarılı',
            description:message
          });
    }, userId);

    return () => {
        signalRService.off(HubUrls.TytHub, ReceiveFunctions.TytDeletedMessage, userId);
        signalRService.off(HubUrls.TytHub, ReceiveFunctions.TytAddedMessage, userId);
        signalRService.off(HubUrls.TytHub, ReceiveFunctions.TytUpdatedMessage, userId);
    };
}, [signalRService, fetchData]);

  useEffect(() => {
    setPage(0); 
  }, [isTyt]);


  return (
    <div className="container space-y-8 max-w-7xl mx-auto">
      <DataTable<tytGenelList,any>
        columns={columns({ isTyt, setIsTyt })} 
        data={data}
        page={page}
        pageSize={pageSize}
        setPage={setPage}
        setPageSize={setPageSize}
        totalPages={totalPages}
        input={input}
        setInput={setInput}
        totalCount={totalCount} 
      />
    </div>
  );
}
