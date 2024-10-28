import React, { Dispatch, SetStateAction } from 'react';
import { useTheme } from 'next-themes';
import TytCreate from '@/components/denemeler/tyt/tyt.create'; // TYT bileşeni
import AytCreate from '@/components/denemeler/ayt/ayt.create'; // AYT bileşeni

// CustomToggle props türü
interface CustomToggleProps {
  isTytSelected: boolean;
  setIsTytSelected: Dispatch<SetStateAction<boolean>>;
}

const CustomToggle: React.FC<CustomToggleProps> = ({ isTytSelected, setIsTytSelected }) => {
  const { theme } = useTheme();

  const handleToggle = () => {
    setIsTytSelected(prevState => !prevState);
  };

  // Temaya göre renkler
  const isDarkTheme = theme === 'dark';

  const backgroundColor = isDarkTheme
    ? (isTytSelected ? 'bg-gray-200' : 'bg-gray-800')
    : (isTytSelected ? 'bg-gray-800' : 'bg-gray-200');

  const thumbColor = isDarkTheme
    ? (isTytSelected ? 'bg-black' : 'bg-white')
    : (isTytSelected ? 'bg-white' : 'bg-black');

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
            className={`absolute top-1/2 transform -translate-y-1/2 w-5 h-5 ${thumbColor} rounded-full shadow-md transition-all duration-500 ease-in-out ${isTytSelected ? 'left-1' : 'left-10'}`}
          ></div>
        </div>

        {/* Sabit AYT Yazısı */}
        <span className="text-lg font-semibold">AYT</span>
      </div>

      {/* Bileşenlerin Gösterimi */}
      {isTytSelected ? <TytCreate isTytSelected={isTytSelected} /> : <AytCreate isTytSelected={isTytSelected}/>}
    </div>
  );
};

export default CustomToggle;
