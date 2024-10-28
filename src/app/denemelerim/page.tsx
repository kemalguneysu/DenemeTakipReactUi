"use client";
import React, { useState } from 'react';
import CustomToggle from './custom.toggle';
import TytList from '@/components/denemeler/tyt/tyt-list/tytList';
import AytList from '@/components/denemeler/ayt/ayt-list/aytList';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';

const Denemelerim = () => {
  const [isTytOpen, setIsTytOpen] = useState(false);
  const [isAytOpen, setIsAytOpen] = useState(false);
  const [isTytSelected, setIsTytSelected] = useState(true);
  return (
    <div>
      <CustomToggle isTytSelected={isTytSelected} setIsTytSelected={setIsTytSelected} />

      {/* TYT Listesi */}
      <div className="mt-4">
        <div
          className="flex items-center cursor-pointer justify-self-center"
          onClick={() => setIsTytOpen(!isTytOpen)}
        >
          <span className="mr-2">TYT Denemelerini Gör</span>
          {isTytOpen ? (
            <ChevronUpIcon className="h-5 w-5" />
          ) : (
            <ChevronDownIcon className="h-5 w-5" />
          )}
        </div>
        {isTytOpen && <TytList />}
      </div>

      {/* AYT Listesi */}
      <div className="mt-4">
        <div
          className="flex items-center cursor-pointer justify-self-center"
          onClick={() => setIsAytOpen(!isAytOpen)}
        >
          <span className="mr-2 ">AYT Denemelerini Gör</span>
          {isAytOpen ? (
            <ChevronUpIcon className="h-5 w-5" />
          ) : (
            <ChevronDownIcon className="h-5 w-5" />
          )}
        </div>
        {isAytOpen && <AytList />}
      </div>
    </div>
  );
};

export default Denemelerim;
