import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    useReactTable,
    VisibilityState,
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
  import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogCancel } from "@/components/ui/alert-dialog"; 
  import { derslerService } from "@/app/services/dersler.service";
  import { Ders, OrderByDirection, tytGenelList } from "@/types";
  import { toast } from "@/hooks/use-toast";
  import { cn } from "@/lib/utils";
  import { denemeService } from "@/app/services/denemeler.service";
  import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
  
  interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    page: number;
    pageSize: number;
    setPage: (page: number) => void;
    setPageSize: (size: number) => void;
    totalPages: number;
    totalCount: number;
    orderByAndDirections: OrderByDirection[];
    setOrderByAndDirections: (order: OrderByDirection[]) => void;
  }
  
  export function DataTable<TData extends tytGenelList, TValue>({
    columns,
    data,
    page,
    pageSize,
    setPage,
    setPageSize,
    totalPages,
    totalCount,
    orderByAndDirections,
    setOrderByAndDirections
  }: DataTableProps<TData, TValue>) {
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [rowSelection, setRowSelection] = React.useState({});
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [selectedSort, setSelectedSort] = React.useState<string | null>("desc");
    const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
    const handleSortChange = (sortOrder: 'asc' | 'desc' | null) => {
      const columnKey = "tarih"; // Sıralamak istediğiniz sütun
        // @ts-ignore
        setOrderByAndDirections((prevOrderBy: OrderByDirection[]) => {
          const updatedOrderBy: OrderByDirection[] = prevOrderBy.filter((item: OrderByDirection) => item.orderBy !== columnKey);
          
          if (sortOrder) {
            updatedOrderBy.push({ orderBy: columnKey, orderDirection: sortOrder });
          } else {
            // Eğer sortOrder null ise, sadece 'tarih' sütununu çıkarıyoruz
            updatedOrderBy.push({ orderBy: columnKey, orderDirection: null });
          }
      
          return updatedOrderBy; // Güncellenmiş durumu döndür
        });
    };
    
    const table = useReactTable({
      data,
      columns,
      getCoreRowModel: getCoreRowModel(),
      onColumnFiltersChange: setColumnFilters,
      getFilteredRowModel: getFilteredRowModel(),
      onRowSelectionChange: setRowSelection,
      onColumnVisibilityChange: setColumnVisibility,
      state: {
        columnFilters,
        rowSelection,
        columnVisibility,
      },
    });
  
    const handleDeleteSelected: (e: React.FormEvent) => Promise<void> = async (e) => {
      e.preventDefault();
      try {
          const response = await denemeService.deleteTytDenemes(
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
              description: 'Seçilen TYT denemesi silinirken bir hata oluştu.',
              variant: 'destructive',
          });
      }
      setDialogOpen(false); 
    };
  
    function getColumnWidth(totalColumns: number, index: number): string {
        const totalRatio = 2 + 3 * (totalColumns - 2); // 1 for first, 3 * (totalColumns - 2) for middle, 1 for last
        if (index === 0 || index === totalColumns - 1) {
          return `${(1 / totalRatio) * 100}%`;
        } else {
          return `${(3 / totalRatio) * 100}%`;
        }
    }
  
    return (
      <div className="max-w-7xl ">
        <div className="flex flex-col gap-2 pb-4">
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  Sütun Filtrele
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" >
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize cursor-pointer"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* İkinci satır: Solda Tarih sıralama, sağda Silme butonu */}
          <div className="flex items-center justify-between">
            {/* Solda Tarihe Göre Sırala */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center justify-center">
                  {selectedSort ? (
                    <span className="cursor-pointer text-center">
                      {selectedSort === "asc" ? "Eskiden-Yeniye" : "Yeniden-Eskiye"}
                    </span>
                  ) : (
                    <span className="flex items-center">
                      Tarihe göre sırala <Icons.arrowDownUp className="ml-2" />
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuCheckboxItem
                  checked={selectedSort === "desc"}
                  onCheckedChange={() => handleSortChange("desc")}
                  onClick={() => setSelectedSort("desc")}
                  className="cursor-pointer"
                >
                  Yeniden-Eskiye
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={selectedSort === "asc"}
                  onCheckedChange={() => handleSortChange("asc")}
                  onClick={() => setSelectedSort("asc")}
                  className="cursor-pointer"
                >
                  Eskiden-Yeniye
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Sağda Silme butonu */}
            <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button variant="outline">
                  Seçilen TYT denemelerini sil <Icons.trash2 className="ml-2" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Silme Onayı</AlertDialogTitle>
                  <AlertDialogDescription>
                    Seçilen TYT denemelerini silmek istediğinize emin misiniz?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="flex justify-end">
                  <AlertDialogCancel>İptal</AlertDialogCancel>
                  <AlertDialogAction onClick={(e) => handleDeleteSelected(e)}>
                    Sil
                  </AlertDialogAction>
                </div>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        <div className="rounded-md border ">
          <Table className="relative">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header, index) => (
                    <TableHead key={header.id} style={{ width: getColumnWidth(headerGroup.headers.length, index) }}>
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
                    {row.getVisibleCells().map((cell, index) => (
                      <TableCell key={cell.id} style={{ width: getColumnWidth(row.getVisibleCells().length, index) }}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    TYT denemesi bulunamadı.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex-1 text-sm text-muted-foreground mt-1">
          {totalCount} adet veriden {table.getFilteredSelectedRowModel().rows.length} tanesi seçildi.
        </div>
  
        <div className="flex items-center space-x-6 lg:space-x-8 mt-1">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Sayfa başı TYT denemesi</p>
            <Select
              value={`${pageSize}`}
              onValueChange={(value) => {
                setPageSize(Number(value));
                setPage(0);
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
            Sayfa {page + 1} / {totalPages}
          </div>
  
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => setPage(0)}
              disabled={page === 0}
            >
              <Icons.chevronsLeft className="h-4 w-4" />
            </Button>
  
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => setPage(page - 1)}
              disabled={page === 0}
            >
              <Icons.chevronLeft className="h-4 w-4" />
            </Button>
  
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => setPage(page + 1)}
              disabled={page >= totalPages - 1}
            >
              <Icons.chevronRight className="h-4 w-4" />
            </Button>
  
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => setPage(totalPages - 1)}
              disabled={page >= totalPages - 1}
            >
              <Icons.chevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }
  