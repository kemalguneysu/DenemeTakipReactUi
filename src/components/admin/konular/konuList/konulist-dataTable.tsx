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
  import React, { Dispatch, SetStateAction } from "react";
  import { Input } from "@/components/ui/input";
  import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
  import { Icons } from "@/components/icons";
  import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogCancel, AlertDialogFooter } from "@/components/ui/alert-dialog"; // AlertDialog bileşenini ekliyoruz.
  import { Ders, ListKonu } from "@/types";
  import { toast } from "@/hooks/use-toast";
import { konularService } from "@/app/services/konular.service";
  
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
    setSelectedDersIds: Dispatch<SetStateAction<string[]>>;
    loading: boolean;
    setLoading: Dispatch<SetStateAction<boolean>>;
    
  }
  function getColumnWidth(totalColumns: number, index: number): string {
    const totalRatio =  3 * (totalColumns - 2)+ 2; ; // 1 for first, 2 * (totalColumns - 2) for middle, 1 for last
    if (index === 0 || index === totalColumns - 1) {
      return `${(1 / totalRatio) * 100}%`; // For the first and last column
    } else {
      return `${(3/ totalRatio) * 100}%`; // For the other columns
    }
    
  }
  export function DataTable<TData extends ListKonu, TValue>({
    columns,
    data,
    page,
    pageSize,
    setPage,
    setPageSize,
    totalPages,
    input,
    setInput,
    setSelectedDersIds,
    totalCount,
    loading,
    setLoading
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
      setLoading(true);
      try {
          const response = await konularService.deleteKonu(
              Object.values(table.getSelectedRowModel().rowsById).map(item => item.original.id)
          );
          if (response.succeeded) {
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
      setLoading(false);

    };
  
    return (
      <div className="max-w-7xl">
        <div className="flex items-center py-4 justify-between">
          <Input
            placeholder="Ara"
            value={input}
            onChange={(event) => {
              setInput(event.target.value);
              setPage(0);
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
                  Seçilen konuyu silmek istediğinize emin misiniz?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>İptal</AlertDialogCancel>
                <AlertDialogAction
                  onClick={(e: any) => {
                    handleDeleteSelected(e); // Silme işlemi
                  }}
                >
                  Sil
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header, index) => (
                    <TableHead
                      key={header.id}
                      style={{
                        width: getColumnWidth(
                          headerGroup.headers.length,
                          index
                        ),
                      }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {data.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell, index) => (
                      <TableCell
                        key={cell.id}
                        style={{
                          width: getColumnWidth(
                            row.getVisibleCells().length,
                            index
                          ),
                        }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    Ders bulunamadı.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex-1 text-sm text-muted-foreground mt-1">
          {totalCount} adet veriden{" "}
          {table.getFilteredSelectedRowModel().rows.length} tanesi seçildi.
        </div>

        <div className="flex items-center lg:space-x-8 mt-1">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Sayfa başı konu</p>
            <Select
              value={`${pageSize}`}
              onValueChange={(value) => {
                setPageSize(Number(value));
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

          <div className="flex flex-col sm:flex-row w-[100px] items-center justify-center text-sm font-medium">
            <span>Sayfa</span>
            <span className="sm:ml-1">
              {page + 1} / {totalPages}
            </span>
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
  