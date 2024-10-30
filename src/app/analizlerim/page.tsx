"use client"; // Client Component olarak işaretleme

import KonuCreate from "@/components/admin/konular/konuCreate/konuCreate";
import KonuList from "@/components/admin/konular/konuList/konuList";
import Analizler from "@/components/analizler/analizler";
import React, { useState } from "react";


const Analizlerim = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <Analizler/>
    </div>
  );
};

export default Analizlerim;
