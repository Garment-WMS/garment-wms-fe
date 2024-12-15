import React from 'react';
import DisposeIntroduction from './components/DisposeIntroduction';
import MaterialDisposeList from './components/MaterialDisposeList';
import ProductDisposeList from './components/ProductDisposeList';

type Props = {};

const DisposeManagement = (props: Props) => {
  return (
    <div className="flex flex-col gap-2">
      <DisposeIntroduction />
      <div className='w-full  bg-white rounded-xl shadow-sm border'>
        <MaterialDisposeList />
        <ProductDisposeList />
      </div>
    </div>
  );
};

export default DisposeManagement;
