import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Ders } from "@/types";
import { Icons } from "@/components/icons";
import React, { Dispatch, SetStateAction, useState } from "react";
import Link from "next/link";
import { derslerService } from "@/app/services/dersler.service";
import { toast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

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
      const [isDialogOpen, setIsDialogOpen] = useState(false);

      const handleDeleteClick = () => {
        setIsDialogOpen(true);
      };

      const confirmDelete = async () => {
        setIsDialogOpen(false); // Close the dialog
        await handleDelete(id); // Call the delete function
      };

      return (
        <div className="justify-self-center">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Icons.dots className="w-5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {/* AlertDialog Trigger */}
              <DropdownMenuItem
                onClick={handleDeleteClick}
                className="cursor-pointer flex items-center justify-center"
              >
                <span className="mr-2">Sil</span>
                <Icons.trash2 className="h-4 w-4" />
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/admin/dersler/${id}`} className="cursor-pointer">
                  <div style={{ textAlign: "center", width: "100%" }}>
                    Detayları Gör
                  </div>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <AlertDialogTrigger asChild>
              <div style={{ display: "none" }} />
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Silme Onayı</AlertDialogTitle>
                <AlertDialogDescription>
                  Seçilen dersi silmek istediğinize emin misiniz?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setIsDialogOpen(false)}>
                  İptal
                </AlertDialogCancel>
                <AlertDialogAction onClick={confirmDelete}>
                  Sil
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      );
    },
  },
];

// Silme işlemi için örnek işlev
const handleDelete = async (id: string) => {
  try {
    const response = await derslerService.deleteDers([id]);
    if (response.succeeded) {
    }
    else
    toast({
      title: 'Başarısız',
      description: response.message,
      variant: 'destructive',
    });

} catch (error: any) {
    toast({
        title: 'Başarısız',
        description: 'Seçilen ders silinirken bir hata oluştu.',
        variant: 'destructive',
    });
}
};
