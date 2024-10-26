import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Icons } from "@/components/icons";
import React, { Dispatch, SetStateAction, useState } from "react";
import Link from "next/link";
import { toast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { konularService } from "@/app/services/konular.service";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronDown, ChevronsDown, ChevronsUpDown } from "lucide-react";
import { Ders, ListKonu } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ColumnsProps {
  isTyt: boolean | null;
  setIsTyt: Dispatch<SetStateAction<boolean | null>>;
  dersListesi: Ders[];
  selectedDersIds: string[];
  setSelectedDersIds: Dispatch<SetStateAction<string[]>>;
}

export const columns = ({ isTyt, setIsTyt, dersListesi, selectedDersIds, setSelectedDersIds }: ColumnsProps): ColumnDef<ListKonu>[] => [
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
    accessorKey: "konuAdi",
    header: () => <div className="text-center">Konu Adı</div>,
    cell: ({ getValue }) => <div className="text-center">{String(getValue())}</div>,
  },
  {
    accessorKey: "dersAdi",
    header: () => {
      const [open, setOpen] = useState(false);
      const [searchTerm, setSearchTerm] = useState("");
  
      // Filter dersListesi based on search input
      const filteredDersListesi = dersListesi.filter((ders) =>
        ders.dersAdi.toLowerCase().includes(searchTerm.toLowerCase())
      );
  
      const handleSelect = (dersId: string) => {
        setSelectedDersIds((prev) =>
          prev.includes(dersId) ? prev.filter((id) => id !== dersId) : [...prev, dersId]
        );
      };
  
      return (
        <div className="justify-items-center">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <button
                role="combobox"
                aria-expanded={open}
                className="flex items-center justify-center space-x-2 w-full sm:w-[200px] p-2 text-center"
              >
                <span>
                  {selectedDersIds.length > 0
                    ? `${selectedDersIds.length} Ders Seçildi`
                    : "Ders Adı"}
                </span>
                <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-full sm:w-[200px] p-0">
              <div className="p-2">
                <div className="mb-2">
                  <input
                    type="text"
                    placeholder="Ders ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full mb-2 border p-1 rounded"
                  />
                </div>
                <ScrollArea className="h-48 w-full rounded-md border">
                  {filteredDersListesi.length === 0 ? (
                    <div className="p-2 text-gray-500">Ders bulunamadı.</div>
                  ) : (
                    <div>
                      {filteredDersListesi.map((ders) => (
                        <div
                          key={ders.id}
                          onClick={() => handleSelect(ders.id)}
                          className="flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
                        >
                          <span>{ders.dersAdi}</span>
                          <Checkbox
                            checked={selectedDersIds.includes(ders.id)}
                            onCheckedChange={() => handleSelect(ders.id)}
                            onClick={() => handleSelect(ders.id)}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      );
    },
    cell: ({ row }) => (
      <div className="text-center text-sm sm:text-base">{row.original.dersAdi}</div> // Adjust text size for smaller screens
    ),
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
                    if (isTyt === null) {
                      setIsTyt(true);
                    } else {
                      setIsTyt(null);
                    }
                  } else {
                    setIsTyt(false);
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
                    if (isTyt === null) {
                      setIsTyt(false);
                    } else {
                      setIsTyt(null);
                    }
                  } else {
                    setIsTyt(true);
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
            <DropdownMenuItem onClick={handleDeleteClick} className="cursor-pointer flex items-center justify-center">
              <span className="mr-2">Sil</span>
              <Icons.trash2 className="h-4 w-4" />
            </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/admin/konular/${id}`} className="cursor-pointer">
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
    const response = await konularService.deleteKonu([id]);
    if (response.succeeded) {
      
    } else {
      toast({
        title: 'Başarısız',
        description: response.message,
        variant: 'destructive',
      });
    }
  } catch (error: any) {
    toast({
      title: 'Başarısız',
      description: 'Seçilen ders silinirken bir hata oluştu.',
      variant: 'destructive',
    });
  }
};
