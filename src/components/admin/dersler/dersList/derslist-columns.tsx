import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Ders } from "@/types";
import { Icons } from "@/components/icons";
import React, { Dispatch, SetStateAction } from "react";
import Link from "next/link";

interface ColumnsProps {
  isTyt: boolean | null;
  setIsTyt: Dispatch<SetStateAction<boolean | null>>;
}

export const columns = ({ isTyt, setIsTyt }: ColumnsProps): ColumnDef<Ders>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
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
    header: () => <div className="text-center">Ders Adı</div>,
    cell: ({ getValue }) => <div className="text-center">{String(getValue())}</div>,
  },
  {
    accessorKey: "isTyt",
    header: () => (
      <div className="items-center justify-self-center">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className="flex items-center justify-self-center w-full">
              <span className="text-center justify-self-center">Ders Türü</span> <Icons.chevronDown className="ml-1 w-4 h-4" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48">
            <DropdownMenuItem>
            <Checkbox
              checked={isTyt === null || isTyt === true} // isTyt null veya true ise checked
              onCheckedChange={(value) => {
                if (value) {
                  // TYT seçildiğinde
                  if (isTyt === null) {
                    setIsTyt(true); // isTyt null ise true yap
                  } else {
                    setIsTyt(null); // Zaten seçiliyse, her ikisini de kaldır
                  }
                } else {
                  // TYT kaldırıldığında
                  setIsTyt(false); // TYT checkbox'ı kaldırılırsa AYT seçili olmalı
                }
              }}
            />
            <span className="ml-2">TYT</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Checkbox
              checked={isTyt === null || isTyt === false} // isTyt null veya false ise checked
              onCheckedChange={(value) => {
                if (value) {
                  // AYT seçildiğinde
                  if (isTyt === null) {
                    setIsTyt(false); // isTyt null ise false yap
                  } else {
                    setIsTyt(null); // Zaten seçiliyse, her ikisini de kaldır
                  }
                } else {
                  // AYT kaldırıldığında
                  setIsTyt(true); // AYT checkbox'ı kaldırıldığında TYT seçili olmalı
                }
              }}
            />
              <span className="ml-2">AYT</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
    cell: ({ getValue }) => (
      <div className="text-center">{(getValue() as boolean) ? "TYT" : "AYT"}</div>
    ),
  },
  {
    id: "actions",
    header: () => <div className="text-center">Aksiyonlar</div>,
    cell: ({ row }) => {
      const { id } = row.original;
      return (
        <div className="justify-self-center">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Icons.dots className="w-5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleDelete(id)}>Sil</DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/admin/dersler/${id}`}>
                  <a>Detayları Gör</a>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];

// Silme işlemi için örnek işlev
const handleDelete = (id: string) => {
  console.log("Deleting item with id:", id);
};
