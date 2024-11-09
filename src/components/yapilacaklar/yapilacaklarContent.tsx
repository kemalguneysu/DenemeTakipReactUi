"use client";
import React, { useEffect, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  MoveDiagonal,
  DiamondPlus,
  Pencil,
  PencilOff,
  CheckCircle,
  Trash2,
  X,
  Plus,
} from "lucide-react";
import {
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  isToday,
  addDays,
  eachDayOfInterval,
} from "date-fns";
import { tr } from "date-fns/locale";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { useTheme } from "next-themes"; // Import Next.js theme hook
import { Input } from "../ui/input";
import { AnimatePresence, motion } from "framer-motion";
import { toDoService } from "@/app/services/toDo.service";
import { toast } from "@/hooks/use-toast";
import { ListToDoElement, toDoElements } from "@/types";


export default function YapilacaklarContent() {
  const { theme } = useTheme(); // Get current theme (dark or light)
  const [view, setView] = useState("weekly");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [today] = useState(new Date());
  const [currentDateRange, setCurrentDateRange] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCompleted, setIsCompleted] = useState<boolean | undefined>();
  const [userToDos, setUserToDos] = useState<ListToDoElement[]>([]);

  useEffect(() => {
    updateDateRange();
  }, [view, today]);

  const updateDateRange = () => {
     if (view === "weekly") {
       const start = startOfWeek(today, { weekStartsOn: 1 });
       const end = endOfWeek(today, { weekStartsOn: 1 });
       setCurrentDateRange(
         `${format(start, "d.MM.yyyy")} - ${format(end, "d.MM.yyyy")}`
       );
     } else {
       const start = startOfMonth(today);
       const end = endOfMonth(today);
       setCurrentDateRange(
         `${format(start, "d.MM.yyyy")} - ${format(end, "d.MM.yyyy")}`
       );
     }
     getUserToDos(view, isCompleted);
  };
  const getUserToDos = async (view: string, isCompleted?: boolean) => {
    let start: Date | null = null;
    let end: Date | null = null;
    if (view === "weekly") {
      start = startOfWeek(today, { weekStartsOn: 1 }); 
      end = endOfWeek(today, { weekStartsOn: 1 }); 
    }
    else if (view === "monthly") {
      start = startOfMonth(today); 
      end = endOfMonth(today); 
    }

    if (start && end) {
      try {
        const response = await toDoService.getToDoElements(
          start,
          end,
          isCompleted
        );
        setUserToDos(response.toDoElements);
      } catch (error) {
      }
    } 
  };
  useEffect(() => {console.log(userToDos)}, [userToDos]);

  const renderWeeklyView = () => {
    const daysOfWeek = Array.from({ length: 7 }).map((_, index) => {
      const day = startOfWeek(today, { weekStartsOn: 1 });
      return addDays(day, index);
    });

    return (
      <div className="grid grid-cols-7 gap-2">
        {daysOfWeek.map((day, index) => {
          const dayKey = format(day, "yyyy-MM-dd");

          // UserToDos verisi burada ListToDoElement içerecek
          const todosForDay = userToDos.find(
            (todo) => format(new Date(todo.date), "yyyy-MM-dd") === dayKey
          )?.toDoElements;

          return (
            <TodoCard
              key={index}
              day={day} // Day, Date tipi olarak geçiyor
              todo={todosForDay || []} // Burada 'todos' değil, 'todo' kullanmalıyız
            />
          );
        })}
      </div>
    );
  };
 const renderMonthlyView = () => {
   // Ayın tüm günlerini alıyoruz
   const daysInMonth = eachDayOfInterval({
     start: startOfMonth(today),
     end: endOfMonth(today),
   });

   return (
     <div className="grid grid-cols-7 gap-2">
       {daysInMonth.map((day, index) => {
         const dayKey = format(day, "yyyy-MM-dd");
         const todosForDay =
           userToDos.find(
             (todo) => format(new Date(todo.date), "yyyy-MM-dd") === dayKey
           )?.toDoElements || [];

         return (
           <div key={index} className="border p-2">
             {/* Her gün için TodoCard bileşenini render ediyoruz */}
             <TodoCard day={day} todo={todosForDay} />
           </div>
         );
       })}
     </div>
   );
 };
  interface TodoCardProps {
    day: Date;
    todo: toDoElements[];
  }
  const TodoCard = ({ day, todo }: TodoCardProps) => {
    const dayOfMonth = format(day, "d");
    const dayName = format(day, "eeee", { locale: tr });

      return (
        <div className="border p-4 rounded shadow-lg flex flex-col">
          {/* Üst kısımda, gün bilgisi ve move ikonunun olduğu alan */}
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm font-normal">{dayOfMonth}</div>
            <div className="text-center text-sm font-normal">{dayName}</div>
            <div className="cursor-pointer">
              <MoveDiagonal size={16} />
            </div>
          </div>

          {/* Görevler kısmı */}
          <div>
            <AnimatePresence>
              {todo.length > 0 ? (
                todo.map((item, index) => (
                  <motion.div
                    key={item.id}
                    className="mt-2 rounded shadow-lg flex flex-col gap-2"
                    initial={{ opacity: 0, y: 20 }} // Animasyon başlangıcı
                    animate={{ opacity: 1, y: 0 }} // Animasyon son hali
                    exit={{ opacity: 0, y: -20 }} // Çıkış animasyonu
                    transition={{ duration: 0.5 }} // Animasyon süresi
                  >
                    {/* Shadcn Card */}
                    <div className="border rounded flex flex-col gap-2">
                      {/* İlk satır: İkonlar */}
                      <div className="flex justify-end gap-2 p-2">
                        <Pencil
                          size={16}
                          className="cursor-pointer"
                          onClick={() => console.log("Edit item", item.id)} // Tıklayınca işlem yapılacak
                        />
                        <Trash2
                          size={16}
                          className="cursor-pointer"
                          onClick={() => console.log("Delete item", item.id)} // Tıklayınca silme işlemi yapılacak
                        />
                      </div>

                      {/* İkinci satır: Başlık ve Checkbox */}
                      <div className="flex items-center gap-2 p-2">
                        <div className="flex-1">{item.toDoElementTitle}</div>
                        <Checkbox id={`checkbox-${item.id}`} />
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="mt-2 p-2 text-gray-400">No tasks for today</div>
              )}
            </AnimatePresence>
          </div>

          {/* Hedef Ekle Butonu */}
          <div className="mt-4">
            <Button
              className="flex items-center gap-2 w-full"
              onClick={() => addAction(day)} // Butona tıklanınca addAction çağrılacak
            >
              <Plus size={16} /> Hedef Ekle
            </Button>
          </div>
        </div>
      );
  };

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const addAction = async (day: Date) => {
    const turkeyTime = new Date(day.getTime() + 3 * 60 * 60 * 1000); // 3 saat ekleyerek Türkiye saatine çevirme
    await toDoService.createToDo("Yeni Hedef", turkeyTime, false);
    await getUserToDos(view,isCompleted);
  };
  
  return (
    <div className="p-4 z-10 relative">
      {/* Header with Dropdown */}
      <div className="flex items-center gap-2 cursor-pointer relative z-10">
        <h1 className="text-xl font-bold">
          {view === "weekly" ? "Haftalık Takip" : "Aylık Takip"}
        </h1>
        {isDropdownOpen ? (
          <ChevronUp onClick={toggleDropdown} />
        ) : (
          <ChevronDown onClick={toggleDropdown} />
        )}

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div
            className={`absolute top-8 left-0 border rounded-md shadow-md p-2 z-20 ${
              theme === "dark" ? "bg-black text-white" : "bg-white text-black"
            }`}
          >
            <div className="rounded-md">
              <div
                onClick={() => {
                  setView("weekly");
                  setIsDropdownOpen(false);
                }}
                className={`cursor-pointer p-2 ${
                  view === "weekly"
                    ? "bg-gray-300 dark:bg-gray-800 rounded-t-md" // Background color for selected "weekly"
                    : "hover:bg-gray-200 dark:hover:bg-gray-700 rounded-t-md"
                }`}
              >
                Haftalık Takip
              </div>
              <div
                onClick={() => {
                  setView("monthly");
                  setIsDropdownOpen(false);
                }}
                className={`cursor-pointer p-2 ${
                  view === "monthly"
                    ? "bg-gray-300 dark:bg-gray-800 rounded-b-md" // Background color for selected "monthly"
                    : "hover:bg-gray-200 dark:hover:bg-gray-700 rounded-b-md"
                }`}
              >
                Aylık Takip
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="mt-2 opacity-80">{currentDateRange}</div>

      {/* Calendar */}
      <div className="mt-4">
        {view === "weekly" ? renderWeeklyView() : renderMonthlyView()}
      </div>
      {isModalOpen && (
        <div
          id="modal-overlay"
          className={`fixed inset-0 flex items-center justify-center ${theme==="dark"?"bg-black":"bg-white"} bg-opacity-50  `}
        >
          <motion.div
            className={`relative p-6 rounded-lg shadow-lg w-1/2 ${
              theme === "dark"
                ? "bg-gray-800 text-white"
                : "bg-white text-black"
            } border`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={(e) => e.stopPropagation()}
          >
            <X
              className="absolute top-4 right-4 cursor-pointer"
            />
          </motion.div>
        </div>
      )}
    </div>
  );
}
