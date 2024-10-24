import { DashboardConfig, FooterItem } from "../types";

export const dashboardConfig: DashboardConfig = {
  mainNav: [
    {
      title: "Ana Sayfa",
      href: "/",
    },
    {
      title: "Denemelerim",
      href: "/denemelerim",
    },
    {
      title: "Analizler",
      href: "/analizler",
    },
    {
      title: "Admin",
      href: "/admin",
      children: [ // Admin altında alt öğeler
        {
          title: "Dersler",
          href: "/admin/dersler",
        },
        {
          title: "Konular",
          href: "/admin/konular",
        },
        {
          title: "Kullanıcılar",
          href: "/admin/kullanicilar",
        },
      ],
    },
  ],
  footerNav: [
    
    // {
    //   title: "Social",
    //   items: [
    //     {
    //       title: "Twitter",
    //       href: "https://twitter.com/docuconnect",
    //       external: true,
    //     },
    //     {
    //       title: "GitHub",
    //       href: "#",
    //       external: true,
    //     },
    //     {
    //       title: "LinkedIn",
    //       href: "https://www.linkedin.com/company/docuconnect",
    //       external: true,
    //     },
    //     {
    //       title: "Instagram",
    //       href: "https://www.instagram.com/docuconnect",
    //       external: true,
    //     },
    //   ],
    // },
  ] satisfies FooterItem[],
};