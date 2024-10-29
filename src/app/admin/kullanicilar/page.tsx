"use client"; // Client Component olarak işaretleme

import KullaniciList from '@/components/admin/kullanicilar/kullanici-list/kullaniciList';
import React, { useState } from 'react';

const Kullanicilar = () => {
  return(
    <div>
        <KullaniciList/>
    </div>
  )
};

export default Kullanicilar;