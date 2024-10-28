"use client";

import { useEffect, useState } from "react";
import { aytGenelList, Ders, OrderByDirection } from "@/types";
import { derslerService } from "@/app/services/dersler.service";
import { useSignalR } from "@/hooks/use-signalr";
import { ReceiveFunctions } from "@/types/receiveFunctions";
import { HubUrls } from "@/types/hubUrls";
import { denemeService } from "@/app/services/denemeler.service";
import authService from "@/app/services/auth.service";
import { HubConnectionBuilder } from "@microsoft/signalr";
import { toast } from "@/hooks/use-toast";
import { DataTable } from "./aytList-dataTable";
import { columns } from "./aytList-columns";

export default function DersList() {
  const [data, setData] = useState<aytGenelList[]>([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const signalRService = useSignalR();
  const [orderByAndDirections, setOrderByAndDirections] = useState<OrderByDirection[]>([]);
  
  // fetchData fonksiyonunu burada tanımlıyoruz
  const fetchData = async () => {
      try {
          const result = await denemeService.getAytDenemes(
            page + 1,
            pageSize,
            orderByAndDirections,
            () => {},
            () => {},
          );
          setData(result.aytDenemes);
          const totalCount = result.totalCount;
          setTotalCount(totalCount); 
          const newTotalPages = Math.ceil(totalCount / pageSize);
          setTotalPages(newTotalPages);
      } catch (error) {
      }
  };

  useEffect(() => {
      fetchData();
  }, [page, pageSize,orderByAndDirections]);


  useEffect(() => {
    const userId = authService.userId as string; 
    signalRService.start(HubUrls.AytHub,userId);
    signalRService.on(HubUrls.AytHub, ReceiveFunctions.AytAddedMessage, async (message) => {
        await fetchData(); 
        toast({
            title: 'Başarılı',
            description: message
          });
    }, userId);

    signalRService.on(HubUrls.AytHub, ReceiveFunctions.AytDeletedMessage, async (message) => {
        await fetchData();
        toast({
            title: 'Başarılı',
            description: message
          });
    }, userId);
    
    signalRService.on(HubUrls.AytHub, ReceiveFunctions.AytUpdatedMessage, async (message) => {
        await fetchData();
        toast({
            title: 'Başarılı',
            description:message
          });
    }, userId);

    return () => {
        signalRService.off(HubUrls.AytHub, ReceiveFunctions.AytDeletedMessage, userId);
        signalRService.off(HubUrls.AytHub, ReceiveFunctions.AytAddedMessage, userId);
        signalRService.off(HubUrls.AytHub, ReceiveFunctions.AytUpdatedMessage, userId);
    };
}, [signalRService, fetchData]);



  return (
    <div className="container space-y-8 max-w-7xl mx-auto">
      <DataTable<aytGenelList, any>
        columns={columns({orderByAndDirections, setOrderByAndDirections })} 
        data={data}
        page={page}
        pageSize={pageSize}
        setPage={setPage}
        setPageSize={setPageSize}
        totalPages={totalPages}
        totalCount={totalCount} 
        orderByAndDirections={orderByAndDirections}
        setOrderByAndDirections={setOrderByAndDirections}
      />
    </div>
  );
}
