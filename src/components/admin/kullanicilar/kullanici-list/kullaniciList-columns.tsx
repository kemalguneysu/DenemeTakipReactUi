import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ders, Role, UserList } from "@/types";
import { Icons } from "@/components/icons";
import React, { Dispatch, SetStateAction, useState } from "react";
import Link from "next/link";
import { derslerService } from "@/app/services/dersler.service";
import { toast } from "@/hooks/use-toast";
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
import { userService } from "@/app/services/user.service";
import { roleService } from "@/app/services/role.service";
import { Check, X } from "lucide-react";

interface ColumnsProps {
  isAdmin: boolean | null;
  setIsAdmin: Dispatch<SetStateAction<boolean | null>>;
}

export const columns = ({
  isAdmin,
  setIsAdmin,
}: ColumnsProps): ColumnDef<UserList>[] => [
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
    accessorKey: "userName",
    header: () => <div className="text-center">Kullanıcı Adı</div>,
    cell: ({ getValue }) => (
      <div className="text-center">{String(getValue())}</div>
    ),
  },
  {
    accessorKey: "email",
    header: () => <div className="text-center">Email</div>,
    cell: ({ getValue }) => (
      <div className="text-center">{String(getValue())}</div>
    ),
  },
  {
    accessorKey: "isAdmin",
    header: () => (
      <div className="items-center justify-self-center">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className="flex items-center justify-self-center w-full">
              <span className="text-center justify-self-center">Admin Rolü</span>{" "}
              <Icons.chevronDown className="ml-1 w-4 h-4" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48">
            <DropdownMenuItem>
              <Checkbox
                checked={isAdmin === null || isAdmin === true} // isTyt null veya true ise checked
                onCheckedChange={(value) => {
                  if (value) {
                    if (isAdmin === null) {
                      setIsAdmin(true);
                    } else {
                      setIsAdmin(null);
                    }
                  } else {
                    setIsAdmin(false);
                  }
                }}
              />
              <span className="ml-2">Admin</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Checkbox
                checked={isAdmin === null || isAdmin === false} // isTyt null veya false ise checked
                onCheckedChange={(value) => {
                  if (value) {
                    if (isAdmin === null) {
                      setIsAdmin(false);
                    } else {
                      setIsAdmin(null);
                    }
                  } else {
                    setIsAdmin(true);
                  }
                }}
              />
              <span className="ml-2">Admin Değil</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),

    cell: ({ getValue }) => {
      const isAdmin = getValue(); // isAdmin değerini al
      return (
        <div className="text-center justify-self-center">
          {isAdmin ? (
            <Check className="text-green-500" /> // isAdmin true ise check ikonu göster
          ) : (
            <X className="text-red-500" /> // isAdmin false ise x ikonu göster
          )}
        </div>
      );
    },
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
              <DropdownMenuItem asChild>
                <Link
                  href={`/admin/kullanicilar/${id}`}
                  className="cursor-pointer"
                >
                  <div style={{ textAlign: "center", width: "100%" }}>
                    Detayları Gör
                  </div>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];


