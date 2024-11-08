"use client";

import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

interface CustomToggleDerslerProps {
  onChange: (isTyt: boolean) => void;
  isTyt?: boolean | null; // isTyt nullable olarak işaretlendi
}

const CustomToggleDersler: React.FC<CustomToggleDerslerProps> = ({ onChange, isTyt }) => {
  const { theme } = useTheme();
  const [isTytSelected, setIsTytSelected] = useState(isTyt ?? true); // Başlangıçta isTyt null ise true (TYT) yap

  // isTyt değiştiğinde state'i güncelle
  useEffect(() => {
    setIsTytSelected(isTyt ?? true); // Eğer isTyt null veya undefined ise TYT (true) yap
  }, [isTyt]);

  const handleToggle = () => {
    const newSelection = !isTytSelected;
    setIsTytSelected(newSelection);
    onChange(newSelection); // Yeni seçimi üst bileşene ilet
  };

  // Temaya göre renkler
  const isDarkTheme = theme === 'dark';

  const backgroundColor = isDarkTheme
    ? (isTytSelected ? 'bg-gray-200' : 'bg-gray-800')  // TYT seçiliyse açık gri, AYT seçiliyse koyu gri arka plan
    : (isTytSelected ? 'bg-gray-800' : 'bg-gray-200'); // TYT seçiliyse koyu gri, AYT seçiliyse açık gri arka plan

  const thumbColor = isDarkTheme
    ? (isTytSelected ? 'bg-black' : 'bg-white')  // TYT seçiliyse siyah, AYT seçiliyse beyaz daire
    : (isTytSelected ? 'bg-white' : 'bg-black'); // TYT seçiliyse beyaz, AYT seçiliyse siyah daire

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center justify-center space-x-4 mt-8">
        <span className="text-lg font-semibold">TYT</span>
        <div
          onClick={handleToggle}
          className={`relative w-16 h-6 ${backgroundColor} rounded-full cursor-pointer transition-colors duration-300`}
        >
          <div
            className={`absolute top-1/2 transform -translate-y-1/2 w-5 h-5 ${thumbColor} rounded-full shadow-md transition-all duration-500 ease-in-out ${
              isTytSelected ? 'left-1' : 'left-10'
            }`}
          ></div>
        </div>
        <span className="text-lg font-semibold">AYT</span>
      </div>
    </div>
  );
};

export default CustomToggleDersler;
