"use client";

import { useEffect, useState } from "react";
import { Ders, OrderByDirection, tytGenelList, TytSingleList } from "@/types";
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
import SpinnerMethodComponent from "@/app/spinner/spinnerForMethods";

export default function DersList() {
  const [data, setData] = useState<tytGenelList[]>([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const signalRService = useSignalR();
  const [orderByAndDirections, setOrderByAndDirections] = useState<OrderByDirection[]>([]);
  const [loading, setLoading] = useState(false);
  
  // fetchData fonksiyonunu burada tanımlıyoruz
  const fetchData = async () => {
    setLoading(true);
      try {
          const result = await denemeService.getTytDenemes(
            page + 1,
            pageSize,
            orderByAndDirections,
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
    setLoading(false);
  
    };

  useEffect(() => {
      fetchData();
  }, [page, pageSize,orderByAndDirections]);


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


  return (
    <div className="container space-y-8 max-w-7xl mx-auto">
      {loading && <SpinnerMethodComponent />}

      <DataTable<tytGenelList, any>
        columns={columns({
          orderByAndDirections,
          setOrderByAndDirections,
          loading,
          setLoading,
        })}
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
