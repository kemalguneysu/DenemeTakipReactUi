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

// Define Action type
interface Action {
  name: string;
  completed: boolean;
  isEditing: boolean;
  editName: string;
}

// Define actions type as an object where each key is a string (the day), and the value is an array of actions.
interface Actions {
  [key: string]: Action[];
}

export default function YapilacaklarContent() {
  const { theme } = useTheme(); // Get current theme (dark or light)
  const [view, setView] = useState("weekly");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [today] = useState(new Date());
  const [currentDateRange, setCurrentDateRange] = useState("");
  const [actions, setActions] = useState<Actions>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDayActions, setSelectedDayActions] = useState<Action[]>([]);
  const [selectedDayKey, setSelectedDayKey] = useState<string | Date | null>(null);
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
  };

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const addAction = (day: Date) => {
    const dayKey = format(day, "yyyy-MM-dd");

    // Get the current UTC time
    const currentTime = new Date();

    const turkeyTime = new Date(currentTime.getTime() + 3 * 60 * 60 * 1000); // Add 3 hours to UTC time

    const startTime = turkeyTime.toISOString().slice(11, 16);

    const endTime = new Date(turkeyTime.getTime() + 60 * 60 * 1000); // Add 1 hour
    const formattedEndTime = endTime.toISOString().slice(11, 16);

    setActions({
      ...actions,
      [dayKey]: [
        ...(actions[dayKey] || []),
        {
          name: "",
          completed: false,
          isEditing: false,
          editName: "",
        },
      ],
    });
  };

  const handleEditActionName = (index: number, dayKey: string) => {
    const updatedActions = [...(actions[dayKey] || [])];
    const action = updatedActions[index];

    // Toggle editing mode
    action.isEditing = !action.isEditing;

    // If not editing, save the edited values
    if (!action.isEditing) {
      action.name = action.editName;
    } else {
      // When entering edit mode, set the fields to current values
      action.editName = action.name;
    }

    setActions({ ...actions, [dayKey]: updatedActions });
    
  };

   const handleDeleteAction = (index: number, dayKey: string) => {
     const updatedActions = [...actions[dayKey]]; // Make a copy of actions for the day
     updatedActions.splice(index, 1); // Remove the action at the given index
     setActions({ ...actions, [dayKey]: updatedActions });
   };

     const openModal = (dayKey: string) => {
       setSelectedDayActions(actions[dayKey] || []);
       setSelectedDayKey(dayKey);
       setIsModalOpen(true);
     };

     const closeModal = () => setIsModalOpen(false);

     const handleOutsideClick = (e: React.MouseEvent) => {
       if ((e.target as HTMLElement).id === "modal-overlay") {
         closeModal();
       }
     };

  const renderDayCard = (day: Date) => {
    const dayKey = format(day, "yyyy-MM-dd");
    const dayActions = actions[dayKey] || [];

    return (
      <div key={dayKey} className="p-4 border rounded relative">
        <div className="flex justify-between items-center w-full">
          {/* Gün numarası (sol üst) */}
          <div className="text-xs font-bold">{format(day, "d")}</div>

          <div className="flex justify-center  text-sm font-semibold">
            {format(day, "eeee", { locale: tr })}{" "}
          </div>

          <div className="cursor-pointer" onClick={() => openModal(dayKey)}>
            <MoveDiagonal size={16} />
          </div>
        </div>

        {dayActions.length === 0 ? (
          <Button
            onClick={() => addAction(day)}
            className="w-full mt-4 flex items-center justify-center gap-2"
          >
            <DiamondPlus size={16} /> Ekle
          </Button>
        ) : (
          <AnimatePresence>
            {dayActions.map((action, index) => (
              <motion.div
                key={index}
                className="mt-4 p-2 border rounded edit-action relative w-full "
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{
                  opacity: 0,
                  scale: 0.8,
                  transition: { duration: 0.3 },
                }}
              >
                {/* Container for pencil and trash icons */}
                <div className="flex justify-between items-start w-full">
                  <div className="flex-grow"></div>{" "}
                  {/* This makes the rest of the space flexible */}
                  <div className="flex gap-2 mb-4">
                    {!action.isEditing ? (
                      <>
                        <Pencil
                          size={16}
                          className="cursor-pointer"
                          onClick={() => handleEditActionName(index, dayKey)} // Toggle edit mode
                        />
                        <Trash2
                          size={16}
                          className="cursor-pointer"
                          onClick={() => handleDeleteAction(index, dayKey)} // Delete the action
                        />
                      </>
                    ) : (
                      <>
                        <PencilOff
                          size={16}
                          className="cursor-pointer"
                          onClick={() => handleEditActionName(index, dayKey)} // Toggle edit mode to save
                        />
                        <Trash2
                          size={16}
                          className="cursor-pointer"
                          onClick={() => handleDeleteAction(index, dayKey)} // Delete the action
                        />
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="flex-grow">
                    {!action.isEditing ? (
                      <div
                        className="text-sm font-medium cursor-pointer w-full"
                        onClick={() => handleEditActionName(index, dayKey)}
                      >
                        {action.name || "Yeni Hedef"}
                      </div>
                    ) : (
                      <input
                        type="text"
                        value={action.editName}
                        onChange={(e) => {
                          const updatedActions = [...dayActions];
                          updatedActions[index].editName = e.target.value;
                          setActions({
                            ...actions,
                            [dayKey]: updatedActions,
                          });
                        }}
                        className="p-1 border rounded w-full"
                        autoFocus
                        onBlur={() => handleEditActionName(index, dayKey)}
                      />
                    )}
                  </div>
                  <div className="flex">
                    <Checkbox
                      checked={action.completed}
                      onCheckedChange={(checked) => {
                        const updatedActions = [...dayActions];
                        updatedActions[index].completed = Boolean(checked);
                        setActions({ ...actions, [dayKey]: updatedActions });
                      }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}

        {/* Action Ekle Butonu */}
        {dayActions.length > 0 && (
          <Button
            onClick={() => addAction(day)}
            className="w-full mt-4 flex items-center justify-center gap-2"
          >
            Ekle
            <DiamondPlus size={16} />
          </Button>
        )}
      </div>
    );

  };

  const renderWeeklyView = () => {
    const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1 });
    const endOfCurrentWeek = endOfWeek(today, { weekStartsOn: 1 });
    const daysOfWeek = eachDayOfInterval({
      start: startOfCurrentWeek,
      end: endOfCurrentWeek,
    });

    return (
      <div className="grid grid-cols-7 gap-4">
        {daysOfWeek.map((day) => renderDayCard(day))}
      </div>
    );
  };

  const renderMonthlyView = () => {
    const startOfCurrentMonth = startOfMonth(today);
    const endOfCurrentMonth = endOfMonth(today);
    const daysInMonth = eachDayOfInterval({
      start: startOfCurrentMonth,
      end: endOfCurrentMonth,
    });

    return (
      <div className="grid grid-cols-7 gap-4">
        {daysInMonth.map((day) => renderDayCard(day))}
      </div>
    );
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

      {/* Date Range */}
      <div className="mt-2 opacity-80">{currentDateRange}</div>

      {/* Calendar */}
      <div className="mt-4">
        {view === "weekly" ? renderWeeklyView() : renderMonthlyView()}
      </div>
      {isModalOpen && (
        <div
          id="modal-overlay"
          className={`fixed inset-0 flex items-center justify-center ${theme==="dark"?"bg-black":"bg-white"} bg-opacity-50  `}
          onClick={handleOutsideClick}
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
              onClick={closeModal}
            />

            {/* Modal Başlık ve Alt Başlık */}
            <h2 className="text-lg font-bold  text-center">
              {selectedDayKey && format(new Date(selectedDayKey), "d.MM.yyyy")}
            </h2>
            <p className="text-sm mb-2 text-center">
              {selectedDayKey &&
                format(new Date(selectedDayKey), "eeee", { locale: tr })}
            </p>

            {/* Görev Durumu Özeti */}
            <p className="text-sm opacity-80 mb-4 text-center">
              {actions[selectedDayKey as string]?.length || 0} görevden{" "}
              {actions[selectedDayKey as string]?.filter(
                (action) => action.completed
              ).length || 0}{" "}
              tanesi tamamlandı.
            </p>

            {/* Aksiyonlar Listesi */}
            {selectedDayActions.length > 0 ? (
              selectedDayActions.map((action, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center mb-4 p-2 border rounded"
                >
                  <div>{action.name || "Yeni Hedef"}</div>
                  <div className="flex gap-2">
                    <Pencil
                      size={16}
                      className="cursor-pointer"
                      onClick={() =>
                        handleEditActionName(index, selectedDayKey as string)
                      }
                    />
                    <Trash2
                      size={16}
                      className="cursor-pointer"
                      onClick={() =>
                        handleDeleteAction(index, selectedDayKey as string)
                      }
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="opacity-80">
                Bu gün için aksiyon bulunmamaktadır.
              </p>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}
