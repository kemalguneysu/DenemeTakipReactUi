"use client"; // Client Component olarak işaretleme

import KonuCreate from '@/components/admin/konular/konuCreate';
import React, { useState } from 'react';

const Konular = () => {
  return(
    <div>
      <KonuCreate /> 
    </div>
  )
};

export default Konular;