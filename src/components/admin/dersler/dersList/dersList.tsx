"use client";

import { useEffect, useState } from "react";
import { DataTable } from "./derslist-dataTable";
import { columns } from "./derslist-columns";
import { Ders } from "@/types";
import { derslerService } from "@/app/services/dersler.service";
import { useSignalR } from "@/hooks/use-signalr";
import { ReceiveFunctions } from "@/types/receiveFunctions";
import { HubUrls } from "@/types/hubUrls";
import SpinnerMethodComponent from "@/app/spinner/spinnerForMethods";

export default function DersList() {
  const [data, setData] = useState<Ders[]>([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [isTyt, setIsTyt] = useState<boolean | null>(null); // Default to null
  const [input, setInput] = useState<string>("");
  const [totalCount, setTotalCount] = useState(0);
  const signalRService = useSignalR();
  const [loading, setLoading] = useState(false);
  // fetchData fonksiyonunu burada tanımlıyoruz
  // const sleep = (ms:any) => {
  //    return new Promise((resolve) => setTimeout(resolve, ms));
  //  };
  //     await sleep(5000);

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await derslerService.getAllDers(
        isTyt,
        input,
        page + 1,
        pageSize,
        () => {}
      );
      setData(result.dersler);
      const totalCount = result.totalCount;
      setTotalCount(totalCount);
      const newTotalPages = Math.ceil(totalCount / pageSize);
      setTotalPages(newTotalPages);
    } catch (error) {}
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [page, pageSize, input, isTyt]);

  useEffect(() => {
    // Ders silindi ve eklendi mesajlarını dinle
    signalRService.on(
      HubUrls.DersHub,
      ReceiveFunctions.DersDeletedMessage,
      async (message) => {
        await fetchData(); // Verileri yeniden yükle
      }
    );

    signalRService.on(
      HubUrls.DersHub,
      ReceiveFunctions.DersAddedMessage,
      async (message) => {
        await fetchData();
      }
    );
    signalRService.on(
      HubUrls.DersHub,
      ReceiveFunctions.DersUpdatedMessage,
      async (message) => {
        await fetchData();
      }
    );

    return () => {
      signalRService.off(HubUrls.DersHub, ReceiveFunctions.DersDeletedMessage);
      signalRService.off(HubUrls.DersHub, ReceiveFunctions.DersAddedMessage);
      signalRService.off(HubUrls.DersHub, ReceiveFunctions.DersUpdatedMessage);
    };
  }, [signalRService, fetchData]);

  useEffect(() => {
    setPage(0);
  }, [isTyt]);

  return (
    <div className="container space-y-8 max-w-7xl mx-auto">
      {loading && <SpinnerMethodComponent />}
      <DataTable<Ders, any>
        columns={columns({ isTyt, setIsTyt,loading,setLoading })} // Pass isTyt and setIsTyt
        data={data}
        page={page}
        pageSize={pageSize}
        setPage={setPage}
        setPageSize={setPageSize}
        totalPages={totalPages}
        input={input}
        setInput={setInput}
        totalCount={totalCount}
        loading={loading}
        setLoading={setLoading}
      />
    </div>
  );
}
