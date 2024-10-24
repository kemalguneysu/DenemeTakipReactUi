"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { Ders } from '@/types';
import { Icons } from "@/components/icons";

export const columns: ColumnDef<Ders>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Hepsini Seç"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Ders Seç"
      />
    ),
  },
  {
    accessorKey: "dersAdi",
    header: "Ders Adı",
    cell: ({ getValue }) => getValue(),
  },
  {
    id: "actions",
    header: "Aksiyonlar",
    cell: ({ row }) => {
      const { id } = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Icons.dots className="w-5"></Icons.dots>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="flex flex-col items-center"> {/* Center the content */}
            <DropdownMenuItem onClick={() => handleDelete(id)} className="w-full text-center justify-center"> {/* Full width for centering */}
              Sil
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/admin/dersler/${id}`}>
                <a className="block w-full text-center px-4 py-2">Detayları Gör</a> {/* View details link */}
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

// Function to handle delete action
const handleDelete = (id: string) => {
  // Implement your delete logic here
  console.log("Deleting item with id:", id);
};
