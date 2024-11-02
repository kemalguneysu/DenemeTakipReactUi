"use client";
import { useState } from "react";
import { LockIcon, CookieIcon, FileTextIcon, Trash2Icon } from "lucide-react";
import ChangePassword from "./sideBarContents/changePassword";
import HandleCookie from "./sideBarContents/handleCookies";
import GetMyDatas from "./sideBarContents/getMyDatas";

type Tab = "changePassword" | "manageCookies" | "myData" | "deleteAccount";

const tabConfig = [
  { id: "changePassword", label: "Şifremi Değiştir", icon: <LockIcon className="h-5 w-5" /> },
  { id: "manageCookies", label: "Çerezleri Yönet", icon: <CookieIcon className="h-5 w-5" /> },
  { id: "myData", label: "Verilerim", icon: <FileTextIcon className="h-5 w-5" /> },
  { id: "deleteAccount", label: "Hesabımı Sil", icon: <Trash2Icon className="h-5 w-5" /> },
];

export default function HesabimContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeTab, setActiveTab] = useState<Tab>("changePassword");

  const renderContent = () => {
    switch (activeTab) {
      case "changePassword":
        return (
          <div>
            <ChangePassword />
          </div>
        );
      case "manageCookies":
        return <div><HandleCookie/></div>;
      case "myData":
        return <div><GetMyDatas/></div>;
      case "deleteAccount":
        return <div>Hesabımı Sil İçeriği</div>;
      default:
        return null;
    }
  };

  return (
    <div className="grid h-full max-w-7xl mx-auto md:grid-cols-7 grid-cols-2">
      <aside className="col-span-2 md:col-span-2 p-4 border-r">
        <h2 className="text-lg font-semibold mb-4">Hesabım</h2>
        <nav className="space-y-2">
          {tabConfig.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`flex items-center justify-start w-full px-4 py-2 rounded-lg 
            ${
              activeTab === tab.id
                ? "bg-gray-800 text-white dark:bg-gray-100 dark:text-black"
                : "text-gray-700 dark:text-gray-300"
            }
          `}
            >
              <span className="flex items-center mr-2">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </aside>
      <main className="col-span-2 md:col-span-5 p-6 flex items-center justify-center">
        <div className="w-full md:w-1/2">{renderContent()}</div>
      </main>
    </div>
  );
}
