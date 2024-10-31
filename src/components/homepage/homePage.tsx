"use client";
import React, { useEffect, useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { denemeService } from "@/app/services/denemeler.service";
import { HomePageAyt, HomePageTyt } from "@/types";
import TYTCard from "./tytCard";
import AYTCard from "./aytCard";
import CountdownTimer from "./countdown";
import TYTCarousel from "./tytCarousel";

const HomePage = () => {
  return (
    <div className="w-full grid grid-cols-5">
      <div className="grid col-start-2 col-span-3">
        <CountdownTimer />
      </div>
      <div className="row-start-2 col-start-1 col-span-5 m-4 flex ">
        <div className="w-3/5">
          <TYTCard />
        </div>
        <div className="h-full flex items-center justify-center w-2/5">
          <TYTCarousel />
        </div>
      </div>
      <div className="row-start-3 col-start-3 col-span-3 m-4">
        <AYTCard />
      </div>
    </div>
  );
};
export default HomePage;
