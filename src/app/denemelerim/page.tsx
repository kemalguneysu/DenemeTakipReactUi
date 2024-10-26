import React, { useState } from 'react';
import CustomToggle from './custom.toggle';
import TytList from '@/components/denemeler/tyt/tyt-list/tytList';

const Denemelerim = () => {
  return(
    <div>
      <CustomToggle />
      <TytList/>
      {/* <AytList/> */}

    </div>
  )
};

export default Denemelerim;
