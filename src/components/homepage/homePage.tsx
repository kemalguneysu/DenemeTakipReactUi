"use client";
import React, { useEffect, useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { denemeService } from "@/app/services/denemeler.service";
import { HomePageAyt, HomePageTyt } from "@/types";
import TYTCard from "./tytCard";
import AYTCard from "./aytCard";
import CountdownTimer from "./countdown";

const HomePage = () => {
  return (
    <div className="w-full grid grid-cols-5">
      <div className="grid col-start-2 col-span-3">
        <CountdownTimer />
      </div>
      <div className="row-start-2 col-start-1 col-span-3 mx-4">
        <TYTCard />
      </div>
      <div className="row-start-3 col-start-3 col-span-3 mx-4">
        <AYTCard />
      </div>
    </div>
  );
};
export default HomePage;
