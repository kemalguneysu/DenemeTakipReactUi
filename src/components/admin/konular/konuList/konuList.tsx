"use client";

import { useEffect, useState } from "react";
import { Ders, ListKonu } from "@/types";
import { useSignalR } from "@/hooks/use-signalr";
import { ReceiveFunctions } from "@/types/receiveFunctions";
import { HubUrls } from "@/types/hubUrls";
import { konularService } from "@/app/services/konular.service";
import { columns } from "./konuList-columns";
import { DataTable } from "./konulist-dataTable";
import { derslerService } from "@/app/services/dersler.service";

export default function KonuList() {
  const [data, setData] = useState<ListKonu[]>([]);
  const [dersListesi, setDersListesi] = useState<Ders[]>([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [isTyt, setIsTyt] = useState<boolean | null>(null); // Default to null
  const [input, setInput] = useState<string>("");
  const [totalCount, setTotalCount] = useState(0);
  const [selectedDersIds, setSelectedDersIds]=useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const signalRService = useSignalR();

  // fetchData fonksiyonunu burada tanımlıyoruz
  const fetchData = async () => {
    setLoading(true);
      try {
          const result = await konularService.getAllKonular(
            isTyt,
            input,
            page+1,
            pageSize,
            selectedDersIds
          );
          setData(result.konular);
          const totalCount = result.totalCount;
          setTotalCount(totalCount); 
          const newTotalPages = Math.ceil(totalCount / pageSize);
          setTotalPages(newTotalPages);
      } catch (error) {
      }
    setLoading(false);

  };
  const fetchDersler=async ()=> {
        try {
            const result = await derslerService.getAllDers(
            isTyt,
            );
            setDersListesi(result.dersler);
        } catch (error) {
        }
    };

  useEffect(() => {
    fetchData();
  }, [page, pageSize, input, isTyt,selectedDersIds]);

  useEffect(() => {
    fetchDersler();
  },[isTyt]);

  useEffect(() => {
    signalRService.on(HubUrls.KonuHub, ReceiveFunctions.KonuDeletedMessage, async (message) => {
        setPage(0);
        await fetchData(); // Verileri yeniden yükle
    });

    signalRService.on(HubUrls.KonuHub, ReceiveFunctions.KonuAddedMessage, async (message) => {
        setPage(0);
        await fetchData();
    });
    signalRService.on(HubUrls.KonuHub, ReceiveFunctions.KonuUpdatedMessage, async (message) => {
        setPage(0);
        await fetchData();
    });

    return () => {
        signalRService.off(HubUrls.KonuHub, ReceiveFunctions.KonuDeletedMessage);
        signalRService.off(HubUrls.KonuHub, ReceiveFunctions.KonuAddedMessage);
        signalRService.off(HubUrls.KonuHub, ReceiveFunctions.KonuUpdatedMessage);
    };
  }, [signalRService, fetchData]);

  useEffect(() => {
    setPage(0); 
  }, [pageSize,input, isTyt,selectedDersIds,isTyt]);


  return (
    <div className="container space-y-8 max-w-7xl mx-auto">
      <DataTable<ListKonu,any>
        columns={columns({ isTyt, setIsTyt,dersListesi,selectedDersIds,setSelectedDersIds,loading,setLoading})} // Pass isTyt and setIsTyt
        data={data}
        page={page}
        pageSize={pageSize}
        setPage={setPage}
        setPageSize={setPageSize}
        totalPages={totalPages}
        input={input}
        setInput={setInput}
        totalCount={totalCount}
        setSelectedDersIds={setSelectedDersIds}
        loading={loading}
        setLoading={setLoading}
      />
    </div>
  );
}
