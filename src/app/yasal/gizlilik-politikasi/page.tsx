"use client"; // Client Component olarak işaretleme

import KonuCreate from "@/components/admin/konular/konuCreate/konuCreate";
import KonuList from "@/components/admin/konular/konuList/konuList";
import Analizler from "@/components/analizler/analizler";
import GizlilikPolitikasiContent from "@/components/yasal/cerezler";
import React, { useState } from "react";

const CerezPolitikasi = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <GizlilikPolitikasiContent/>
    </div>
  );
};

export default CerezPolitikasi;
