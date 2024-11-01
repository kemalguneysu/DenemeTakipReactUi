"use client"; // Client Component olarak işaretleme

import KullanimSartlariContent from "@/components/yasal/kullanımSartlari";
import React, { useState } from "react";

const KullanimSartlari = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <KullanimSartlariContent />
    </div>
  );
};

export default KullanimSartlari;
