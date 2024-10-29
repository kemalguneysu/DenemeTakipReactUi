"use client";

import { useEffect, useState } from "react";
import { derslerService } from "@/app/services/dersler.service";
import { useSignalR } from "@/hooks/use-signalr";
import { ReceiveFunctions } from "@/types/receiveFunctions";
import { HubUrls } from "@/types/hubUrls";
import { userService } from "@/app/services/user.service";
import { UserList } from "@/types";
import { DataTable } from "./kullaniciList-dataTable";
import { columns } from "./kullaniciList-columns";

export default function KullaniciList() {
  const [data, setData] = useState<UserList[]>([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [input, setInput] = useState<string>("");
  const [totalCount, setTotalCount] = useState(0);
  const signalRService = useSignalR();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null); // Default to null

  // fetchData fonksiyonunu burada tanımlıyoruz
  const fetchData = async () => {
    try {
      const result = await userService.getAllUsers(
        page + 1,
        pageSize,
        input,
        isAdmin,
        undefined,
        undefined
      );
      setData(result.users);
      const totalCount = result.totalCount;
      setTotalCount(totalCount);
      const newTotalPages = Math.ceil(totalCount / pageSize);
      setTotalPages(newTotalPages);
    } catch (error) {}
  };

  useEffect(() => {
    fetchData();
  }, [page, pageSize, input,isAdmin]);
  
  useEffect(() => {
    setPage(0);
  }, [pageSize,input, isAdmin]);

  return (
    <div className="container space-y-8 max-w-7xl mx-auto">
      <DataTable<UserList, any>
        columns={columns({ isAdmin, setIsAdmin })}
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
