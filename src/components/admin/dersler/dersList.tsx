"use client";

import { useEffect, useState } from "react";
import { DataTable } from "./dersList/derslist-dataTable"; // Adjust path as necessary
import { columns } from "./dersList/derslist-columns"; // Adjust path as necessary
import { Ders } from "@/types";
import { derslerService } from "@/app/services/dersler.service";
import CustomToggleDersler from "@/app/admin/dersler/custom.toggle.dersler";
import React from "react";

export default function DersList() {
  const [data, setData] = useState<Ders[]>([]);
  const [page, setPage] = useState(0); // Set to 0 for zero-based index
  const [pageSize, setPageSize] = useState(5); // Default page size
  const [totalPages, setTotalPages] = useState(1);
  const [isTyt, setIsTyt] = useState<boolean>(true); // Default to TYT selected
  const [input, setInput] = useState<string>("");
  
  useEffect(() => {
    setPage(0); 
  }, [isTyt]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await derslerService.getAllDers(
          isTyt, // Filter by isTyt
          input, // Filter by dersAdi
          page + 1, // Send the current page (1-based for API)
          pageSize, // Send the current page size
          () => console.log("Data loaded successfully."),
          (errorMessage) => console.error("An error occurred:", errorMessage)
        );

        setData(result.dersler);
        const totalCount = result.totalCount;

        // Calculate total pages correctly
        const newTotalPages = Math.ceil(totalCount / pageSize);
        setTotalPages(newTotalPages);
      } catch (error) {
        console.error("An error occurred while fetching data:", error);
      }
    };

    fetchData();
  }, [page, pageSize, input, isTyt]); // Re-fetch data when these dependencies change

  return (
    <div>
      <CustomToggleDersler onChange={(value: boolean) => setIsTyt(value)} />
      <div className="container space-y-8 max-w-7xl mx-auto">
        <DataTable
          columns={columns}
          data={data}
          page={page}
          pageSize={pageSize}
          setPage={setPage}
          setPageSize={setPageSize}
          totalPages={totalPages}
          input={input} // New prop
          setInput={setInput} // New prop
        />
      </div>
    </div>
  );
}
