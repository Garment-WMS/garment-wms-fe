import { Label } from '@/components/ui/Label';
import React from 'react';

type Props = {};

const MaterialDisposeList = (props: Props) => {
  return (
    <div className="w-full  bg-white rounded-xl shadow-sm border">
      <div className="p-4">
        <Label className="text-2xl ">Material Management</Label>
      </div>
    </div>
  );
};

export default MaterialDisposeList;
