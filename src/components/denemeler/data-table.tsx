"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox"; // ShadCN Checkbox bileşeni
import { Button } from "../ui/button"; // ShadCN Button bileşeni
import { Icons } from "../icons"; // Düzenleme/Silme ikonları
import { tytGenelList } from "@/types";

// Modeli içe aktar

// Örnek veri kümesi
const data: tytGenelList[] = [
  { id: "1", turkceNet: 35, matematikNet: 28, sosyalNet: 27, fenNet: 30, toplamNet: 120 },
  { id: "2", turkceNet: 22, matematikNet: 18, sosyalNet: 20, fenNet: 19, toplamNet: 79 },
  { id: "3", turkceNet: 40, matematikNet: 38, sosyalNet: 29, fenNet: 32, toplamNet: 139 },
];

// Kolonlar tanımı
const columns: ColumnDef<tytGenelList>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Tümünü Seç"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label={`Satır ${row.original.id} seç`}
      />
    ),
  },
  {
    accessorKey: "turkceNet",
    header: "Türkçe Net",
  },
  {
    accessorKey: "matematikNet",
    header: "Matematik Net",
  },
  {
    accessorKey: "sosyalNet",
    header: "Sosyal Net",
  },
  {
    accessorKey: "fenNet",
    header: "Fen Net",
  },
  {
    accessorKey: "toplamNet",
    header: "Toplam Net",
  },
  {
    id: "actions",
    header: "İşlemler",
    cell: ({ row }) => (
      <div className="flex gap-2">
        <Button variant="ghost" size="icon">
          <Icons.edit className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <Icons.trash className="w-4 h-4" />
        </Button>
      </div>
    ),
  },
];

export default function DataTable() {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    pageCount: Math.ceil(data.length / pageSize),
  });

  return (
    <div className="p-4">
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="border border-gray-300 p-2">
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="border border-gray-300 p-2">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Sayfalama (Pagination) */}
      <div className="flex items-center justify-between mt-4">
        <Button onClick={() => setPage((old) => Math.max(old - 1, 0))} disabled={page === 0}>
          Önceki
        </Button>
        <span>
          Sayfa {page + 1} / {Math.ceil(data.length / pageSize)}
        </span>
        <Button
          onClick={() => setPage((old) => old + 1)}
          disabled={page >= Math.ceil(data.length / pageSize) - 1}
        >
          Sonraki
        </Button>
      </div>
    </div>
  );
}
