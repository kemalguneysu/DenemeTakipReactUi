"use client";

import React, { useState } from 'react';
import { useTheme } from 'next-themes';
import TytCreate from '@/components/denemeler/tyt/tyt.create'; // TYT bileşeni
import AytCreate from '@/components/denemeler/ayt/ayt.create'; // AYT bileşeni

const CustomToggle = () => {
  const { theme } = useTheme();
  const [isTytSelected, setIsTytSelected] = useState(true);

  const handleToggle = () => {
    setIsTytSelected(!isTytSelected);
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
        {/* Sabit TYT Yazısı */}
        <span className="text-lg font-semibold">TYT</span>

        {/* Kısaltılmış Toggle Bar */}
        <div
          onClick={handleToggle}
          className={`relative w-16 h-6 ${backgroundColor} rounded-full cursor-pointer transition-colors duration-300`}
        >
          {/* Daire (Thumb) */}
          <div
            className={`absolute top-1/2 transform -translate-y-1/2 w-5 h-5 ${thumbColor} rounded-full shadow-md transition-all duration-500 ease-in-out ${
              isTytSelected ? 'left-1' : 'left-10'
            }`}
          ></div>
        </div>

        {/* Sabit AYT Yazısı */}
        <span className="text-lg font-semibold">AYT</span>
      </div>

      {/* Bileşenlerin Gösterimi */}
      {isTytSelected ? <TytCreate /> : <AytCreate />}
    </div>
  );
};

export default CustomToggle;
