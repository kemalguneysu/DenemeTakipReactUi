"use client"; // Client Component olarak işaretleme

import KonuCreate from '@/components/admin/konular/konuCreate/konuCreate';
import KonuList from '@/components/admin/konular/konuList/konuList';
import React, { useState } from 'react';

const Konular = () => {
  return(
    <div>
      <KonuCreate /> 
      <KonuList/>
    </div>
  )
};

export default Konular;