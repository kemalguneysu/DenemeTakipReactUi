"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes"; // next-themes'den ThemeProvider'ı içe aktar
import { ReactNode } from "react"; // ReactNode'u içe aktar

interface ThemeProviderProps {
  children: ReactNode; // children'ı tanımla
  attribute?: string; // isteğe bağlı attribute
  defaultTheme?: string; // varsayılan tema
  enableSystem?: boolean; // isteğe bağlı enableSystem
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider defaultTheme="light" {...props}>
      {children}
    </NextThemesProvider>
  ); // defaultTheme'i light olarak ayarla
}