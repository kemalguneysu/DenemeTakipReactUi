"use client";
import React, { useEffect, useState } from "react";
import BosYanlisAnalizler from "./bosYanlisAnalizler";
import NetAnalizler from "./netAnalizler";

const Analizler = () => {
  
  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-5">
      <div className="row-start-1 col-start-1 lg:col-span-3 mx-4">
        <NetAnalizler />
      </div>
      <div className="row-start-2 lg:col-start-3 lg:col-span-3 mx-4">
        <BosYanlisAnalizler />
      </div>
    </div>
  );
};

export default Analizler;
