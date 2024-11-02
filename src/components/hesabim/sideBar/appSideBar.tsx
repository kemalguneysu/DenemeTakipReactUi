
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { CookieIcon, FileTextIcon, LockIcon, Trash2 } from "lucide-react";
import { Cookie } from "next/font/google";
{/* <SidebarProvider>
  <AppSidebar />
  <main>
    <SidebarTrigger />
    {children}
  </main>
</SidebarProvider>; */}
// Menu items.
const items = [
  {
    title: "Şifremi Değiştir",
    url: "#",
    icon: LockIcon,
  },
  {
    title: "Çerezleri Yönet",
    url: "#",
    icon: CookieIcon,
  },
  {
    title: "Verilerim",
    url: "#",
    icon: FileTextIcon,
  },
  {
    title: "Hesabımı Sil",
    url: "#",
    icon: Trash2,
  },
];

export function AppSidebar() {
  return (
    <Sidebar  collapsible="none" >
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-md">Hesabım</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
