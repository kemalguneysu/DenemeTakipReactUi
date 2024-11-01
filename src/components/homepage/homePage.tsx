"use client";
import React, { useEffect, useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { denemeService } from "@/app/services/denemeler.service";
import { HomePageAyt, HomePageTyt } from "@/types";
import TYTCard from "./tytCard";
import AYTCard from "./aytCard";
import CountdownTimer from "./countdown";
import TYTCarousel from "./tytCarousel";
import AYTCarousel from "./aytCarousel";

const HomePage = () => {
  return (
    <div className="w-full grid grid-cols-1">
      {/* Countdown Timer */}
      <div className="m-4 md:w-3/5 md:mx-auto">
        <CountdownTimer />
      </div>

      {/* TYT Section */}
      <div className="m-4 flex flex-col md:flex-row">
        {" "}
        {/* Mobilde dikey, büyük ekranda yatay */}
        <div className="w-full md:w-3/5">
          {" "}
          {/* Mobilde tam genişlik, büyük ekranda 3/5 */}
          <TYTCard />
        </div>
        <div className="h-full flex items-center justify-center w-full md:w-2/5">
          {" "}
          {/* Mobilde tam genişlik, büyük ekranda 2/5 */}
          <TYTCarousel />
        </div>
      </div>

      {/* AYT Section */}
      <div className="m-4 flex flex-col md:flex-row">
        {" "}
        {/* Mobilde dikey, büyük ekranda yatay */}
        <div className="h-full flex items-center justify-center w-full md:w-2/5">
          {" "}
          {/* Mobilde tam genişlik, büyük ekranda 2/5 */}
          <AYTCarousel />
        </div>
        <div className="w-full md:w-3/5">
          {" "}
          {/* Mobilde tam genişlik, büyük ekranda 3/5 */}
          <AYTCard />
        </div>
      </div>
    </div>
  );
};
export default HomePage;
