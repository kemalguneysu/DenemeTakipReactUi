import { denemeService } from "@/app/services/denemeler.service";
import { Icons } from "@/components/icons";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import { aytGenelList, tytGenelList } from "@/types";
import { ColumnDef, CellContext } from "@tanstack/react-table";
import Link from "next/link";
import { Dispatch, SetStateAction, useState } from "react";

// Step 1: Update ColumnsProps
interface ColumnsProps {
  orderByAndDirections: Array<{ orderBy: string; orderDirection: "asc" | "desc"| null }>; // Use the correct type
  setOrderByAndDirections: Dispatch<
    SetStateAction<Array<{ orderBy: string; orderDirection: "asc" | "desc"| null }>>
  >;
}

export const columns = ({
  orderByAndDirections,
  setOrderByAndDirections,
}: ColumnsProps): ColumnDef<aytGenelList>[] => {
  const handleSort = (columnKey: keyof aytGenelList) => {
    const currentSort = orderByAndDirections.find((item) => item.orderBy === columnKey);
    let newDirection: "asc" | "desc" | null = null;

    // Determine the new sorting direction
    if (!currentSort) {
      newDirection = "desc"; // Default to descending if not previously sorted
    } else if (currentSort.orderDirection === "desc") {
      newDirection = "asc"; // Next direction is ascending
    } else {
      setOrderByAndDirections([]);
      return;
    }

    const updatedOrderBy = newDirection ? [{ orderBy: columnKey, orderDirection: newDirection }] : [];
    setOrderByAndDirections(updatedOrderBy);
  };

  return [
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
      enableHiding: false,
    },
    {
        accessorKey: "sayisalNet",
        header: () => (
          <div
            className="text-center cursor-pointer flex flex-col items-center justify-center"
            onClick={() => handleSort("sayisalNet")}
          >
            Sayısal Net
            {(() => {
              const currentSort = orderByAndDirections.find(item => item.orderBy === "sayisalNet");
              if (currentSort) {
                return currentSort.orderDirection === "asc" ? (
                  <Icons.arrowUp className="h-4 w-4" />
                ) : (
                  <Icons.arrowDown className="h-4 w-4" />
                );
              }
              return <Icons.arrowDownUp className="h-4 w-4" />;
            })()}
          </div>
        ),
        cell: ({ getValue }: CellContext<aytGenelList, any>) => (
          <div className="text-center">{String(getValue())}</div>
        ),
      },
      {
        accessorKey: "esitAgirlikNet",
        header: () => (
          <div
            className="text-center cursor-pointer flex flex-col items-center justify-center"
            onClick={() => handleSort("esitAgirlikNet")}
          >
            Eşit Ağırlık Net
            {(() => {
              const currentSort = orderByAndDirections.find(item => item.orderBy === "esitAgirlikNet");
              if (currentSort) {
                return currentSort.orderDirection === "asc" ? (
                  <Icons.arrowUp className="h-4 w-4" />
                ) : (
                  <Icons.arrowDown className="h-4 w-4" />
                );
              }
              return <Icons.arrowDownUp className="h-4 w-4" />;
            })()}
          </div>
        ),
        cell: ({ getValue }: CellContext<aytGenelList, any>) => (
          <div className="text-center">{String(getValue())}</div>
        ),
      },
      {
        accessorKey: "sozelNet",
        header: () => (
          <div
            className="text-center cursor-pointer flex flex-col items-center justify-center"
            onClick={() => handleSort("sozelNet")}
          >
            Sözel Net
            {(() => {
              const currentSort = orderByAndDirections.find(item => item.orderBy === "sozelNet");
              if (currentSort) {
                return currentSort.orderDirection === "asc" ? (
                  <Icons.arrowUp className="h-4 w-4" />
                ) : (
                  <Icons.arrowDown className="h-4 w-4" />
                );
              }
              return <Icons.arrowDownUp className="h-4 w-4" />;
            })()}
          </div>
        ),
        cell: ({ getValue }: CellContext<aytGenelList, any>) => (
          <div className="text-center">{String(getValue())}</div>
        ),
      },
      {
        accessorKey: "dilNet",
        header: () => (
          <div
            className="text-center cursor-pointer flex flex-col items-center justify-center"
            onClick={() => handleSort("dilNet")}
          >
            Dil Net
            {(() => {
              const currentSort = orderByAndDirections.find(item => item.orderBy === "dilNet");
              if (currentSort) {
                return currentSort.orderDirection === "asc" ? (
                  <Icons.arrowUp className="h-4 w-4" />
                ) : (
                  <Icons.arrowDown className="h-4 w-4" />
                );
              }
              return <Icons.arrowDownUp className="h-4 w-4" />;
            })()}
          </div>
        ),
        cell: ({ getValue }: CellContext<aytGenelList, any>) => (
          <div className="text-center">{String(getValue())}</div>
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
          setIsDialogOpen(false);
          await handleDelete(id);
        };

        return (
          <div className="justify-self-center">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Icons.dots className="w-5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  onClick={handleDeleteClick}
                  className="cursor-pointer flex items-center justify-center"
                >
                  <span className="mr-2">Sil</span>
                  <Icons.trash2 className="h-4 w-4" />
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href={`/denemelerim/ayt/${id}`}
                    className="cursor-pointer"
                  >
                    <div className="text-center w-full dark:text-white text-black">
                      {" "}
                      {/* Karanlık ve aydınlık tema için renkler */}
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
                    Seçilen AYT denemesini silmek istediğinize emin misiniz?
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
      enableHiding: false,
    },
  ];
};

// Silme işlemi için örnek işlev
const handleDelete = async (id: string) => {
  try {
    const response = await denemeService.deleteAytDenemes([id]);
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
