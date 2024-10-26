import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Ders, tytGenelList } from "@/types";
import { Icons } from "@/components/icons";
import React, { Dispatch, SetStateAction, useState } from "react";
import Link from "next/link";
import { derslerService } from "@/app/services/dersler.service";
import { toast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { denemeService } from "@/app/services/denemeler.service";

interface ColumnsProps {
  isTyt: boolean | null;
  setIsTyt: Dispatch<SetStateAction<boolean | null>>;
}

export const columns = ({ isTyt, setIsTyt }: ColumnsProps): ColumnDef<tytGenelList>[] => [
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
    accessorKey: "turkceNet",
    header: () => <div className="text-center">Türkçe Net</div>,
    cell: ({ getValue }) => <div className="text-center">{String(getValue())}</div>,
  },
  {
    accessorKey: "matematikNet",
    header: () => <div className="text-center">Matematik Net</div>,
    cell: ({ getValue }) => <div className="text-center">{String(getValue())}</div>,
  },
  {
    accessorKey: "fenNet",
    header: () => <div className="text-center">Fen Net</div>,
    cell: ({ getValue }) => <div className="text-center">{String(getValue())}</div>,
  },
  {
    accessorKey: "sosyalNet",
    header: () => <div className="text-center">Sosyal Net</div>,
    cell: ({ getValue }) => <div className="text-center">{String(getValue())}</div>,
  },
  {
    accessorKey: "toplamNet",
    header: () => <div className="text-center">Toplam Net</div>,
    cell: ({ getValue }) => <div className="text-center">{String(getValue())}</div>,
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
              <DropdownMenuItem onClick={handleDeleteClick} className="cursor-pointer flex items-center justify-center">
                <span className="mr-2">Sil</span>
                <Icons.trash2 className="h-4 w-4" />
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/denemelerim/tyt/${id}`} className="cursor-pointer">
                  <div style={{ textAlign: "center", width: "100%" }}>Detayları Gör</div>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* AlertDialog for Delete Confirmation */}
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
                <AlertDialogCancel onClick={() => setIsDialogOpen(false)}>İptal</AlertDialogCancel>
                <AlertDialogAction onClick={confirmDelete}>Sil</AlertDialogAction>
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
    const response = await denemeService.deleteTytDenemes([id]);
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
