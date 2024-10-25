import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Icons } from "@/components/icons";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogCancel } from "@/components/ui/alert-dialog"; // AlertDialog bileşenini ekliyoruz.
import { derslerService } from "@/app/services/dersler.service";
import { Ders } from "@/types";
import { toast } from "@/hooks/use-toast";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  page: number;
  pageSize: number;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  totalPages: number;
  input: string; // Yeni prop
  setInput: (value: string) => void; // Yeni prop
  totalCount: number;
}

export function DataTable<TData extends Ders, TValue>({
  columns,
  data,
  page,
  pageSize,
  setPage,
  setPageSize,
  totalPages,
  input,
  setInput,
  totalCount,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = React.useState({});
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      columnFilters,
      rowSelection,
    },
  });

  const handleDeleteSelected: (e: React.FormEvent) => Promise<void> = async (e) => {
    e.preventDefault();
    try {
        const response = await derslerService.deleteDers(
            Object.values(table.getSelectedRowModel().rowsById).map(item => item.original.id)
        );
        if (response.succeeded) {
            toast({
                title: 'Başarılı',
                description: response.message,
            });
            const selectedRows = table.getSelectedRowModel().rows;
            selectedRows.splice(0, selectedRows.length); 
            table.setRowSelection({});
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
            description: 'Seçilen dersler silinirken bir hata oluştu.',
            variant: 'destructive',
        });
    }
    setDialogOpen(false); 
  };

  return (
    <div>
      <div className="flex items-center py-4 justify-between">
        <Input
          placeholder="Ara"
          value={input}
          onChange={(event) => {
            setInput(event.target.value); // Girdi değerini güncelle
            setPage(0); // Girdi değiştiğinde sayfayı 0'a sıfırla
          }}
          className="max-w-sm"
        />
        <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <AlertDialogTrigger asChild>
              <Button variant="outline" className="ml-4">
                Seçilen dersleri sil <Icons.trash2 className="ml-2" />
              </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Silme Onayı</AlertDialogTitle>
              <AlertDialogDescription>
                Seçilen dersleri silmek istediğinize emin misiniz?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="flex justify-end">
              <AlertDialogCancel>İptal</AlertDialogCancel>
              <AlertDialogAction
                onClick={(e) => {
                  handleDeleteSelected(e); // Silme işlemi
                }}
              >
                Sil
              </AlertDialogAction>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {data.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Sonuç bulunamadı.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex-1 text-sm text-muted-foreground">
        {totalCount} adet veriden {table.getFilteredSelectedRowModel().rows.length} tanesi seçildi.
        
      </div>

      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Sayfa başı ders</p>
          <Select
            value={`${pageSize}`}
            onValueChange={(value) => {
              setPageSize(Number(value)); // Yeni sayfa boyutunu ayarla
              setPage(0); // Sayfa boyutu değiştiğinde sayfayı 0'a sıfırla
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={pageSize.toString()} />
            </SelectTrigger>
            <SelectContent side="top">
              {[5, 10, 15, 20].map((size) => (
                <SelectItem key={size} value={`${size}`}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Sayfa {page + 1} / {totalPages} {/* Sayfa gösterimi ayarla */}
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => setPage(0)} // İlk sayfaya git
            disabled={page === 0}
          >
            <Icons.chevronsLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => setPage(page - 1)} // Önceki sayfaya git
            disabled={page === 0}
          >
            <Icons.chevronLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => setPage(page + 1)} // Sonraki sayfaya git
            disabled={page >= totalPages - 1}
          >
            <Icons.chevronRight className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => setPage(totalPages - 1)} // Son sayfaya git
            disabled={page >= totalPages - 1}
          >
            <Icons.chevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
