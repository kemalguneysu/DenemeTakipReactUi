"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Icons } from "./icons";
import { cn } from "@/lib/utils";
import { NavItem } from "@/types";
import { useSelectedLayoutSegment } from "next/navigation";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
import { ModeToggle } from "./mode-toggle";
import AuthService from "@/app/services/auth.service"; // AuthService'i içe aktar
import { useRouter } from "next/navigation"; // useRouter hook'unu içe aktar
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../components/ui/dropdown-menu";


interface NavProps {
  items: NavItem[];
  children?: React.ReactNode;
}

export default function Footer({ items }: NavProps) {
  const segment = useSelectedLayoutSegment();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false); // Admin durumu için state
  const router = useRouter(); // useRouter hook'unu kullanarak yönlendirme işlemi

  useEffect(() => {
    const subscription = AuthService.authStatus$().subscribe(({ isAuthenticated, isAdmin }) => {
      setIsAuthenticated(isAuthenticated);
      setIsAdmin(isAdmin);
    });

    // İlk durumu kontrol et
    AuthService.identityCheck();

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = () => {
    AuthService.signOut(); // Çıkış yap
    router.push("/"); // Anasayfaya yönlendir
  };

  const renderNavItems = (items: NavItem[]) => {
    return items.map((item, index) => {
      // Eğer Admin öğesi ve isAdmin değeri false ise, bu öğeyi atla
      if (item.title === "Admin" && !isAdmin) {
        return null; // isAdmin false ise hiçbir şey döndürme
      }
      

      // Eğer çocuk öğeleri varsa, dropdown menü oluştur
      if (item.children && item.children.length > 0) {
        return (
          <DropdownMenu key={index}>
            <DropdownMenuTrigger>
              <span className="flex items-center text-md font-medium transition-colors hover:text-foreground/80">{item.title}</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="z-50"> {/* Dropdown'un z-index'ini artır */}
              {item.children.map((child, childIndex) => (
                <DropdownMenuItem key={childIndex}>
                  <Link href={child.disabled ? "#" : child.href}>
                    {child.title}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      }

      return (
        <Link
          key={index}
          href={item.disabled ? "#" : item.href}
          className={cn(
            "flex items-center text-md font-medium transition-colors hover:text-foreground/80",
            item.href.startsWith(`/${segment}`) ? "text-foreground" : "text-foreground/60",
            item.disabled && "cursor-not-allowed opacity-80"
          )}
        >
          {item.title}
        </Link>
      );
    });
  };

  return (
    <nav className="sticky max-w-7xl mx-auto top-0 z-40 w-full bg-background">
      <div className="flex py-3 px-4 gap-8 items-center">
        <div className="flex w-full items-center justify-between gap-12">
          <Link href="/" className="flex items-center space-x-2">
            <h1 className="font-bold text-xl sm:inline-block">Deneme Takip</h1>
          </Link>
          
          <nav className="hidden md:flex gap-6">
            {renderNavItems(items)}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <ModeToggle />
          <div className="md:hidden flex">
            <Drawer>
              <DrawerTrigger>
                <Icons.menu className="w-5 h-5" />
              </DrawerTrigger>
              <DrawerContent
                onOpenAutoFocus={(event) => {
                  event.preventDefault();
                }}
                className="max-w-md transition-all ease-in-out w-full mx-auto"
              >
                <DrawerHeader>
                  <DrawerTitle>Menu</DrawerTitle>
                  <DrawerClose />
                </DrawerHeader>
                {items?.length ? (
                  <div className="flex flex-col items-center gap-4 py-4">
                    {renderNavItems(items)}
                    {/* Giriş Yap veya Çıkış Yap Linki */}
                    {!isAuthenticated ? (
                      <Link href="/giris-yap" className="flex items-center text-lg font-medium transition-colors hover:text-foreground/80">
                        Giriş Yap
                      </Link>
                    ) : (
                      <button
                        onClick={handleSignOut}
                        className="flex items-center text-lg font-medium transition-colors hover:text-foreground/80"
                      >
                        Çıkış Yap
                      </button>
                    )}
                  </div>
                ) : null}
              </DrawerContent>
            </Drawer>
          </div>

          {/* Masaüstü için kullanıcı simgesi */}
          {!isAuthenticated ? ( // Kullanıcı oturumu açmamışsa giriş simgesini göster
            <Link href="/giris-yap" className="hidden md:flex items-center">
              <Icons.user className="w-5 h-5" />
            </Link>
          ) : (
            // Kullanıcı oturumu açmışsa çıkış simgesini göster
            <button
              onClick={handleSignOut}
              className="hidden md:flex items-center"
            >
              <Icons.logOut className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
