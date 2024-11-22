import React, { useState } from 'react';
import Process from './Process';
import { useSelector } from 'react-redux';
import importRequestSelector from '../slice/selector';
import { ImportRequest } from '@/types/ImportRequestType';
import InspectionStep from './Actions/Inspection';

interface Props {}

const IRProcessAndAction: React.FC<Props> = (props) => {
  const [selectedStep, setSelectedStep] = useState<number | null>(0); // State for the selected step
  const importRequest: ImportRequest = useSelector(importRequestSelector.importRequest);

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border-2 p-4">
      <Process
        currentStatus={importRequest?.status as string}
        setSelectedStep={setSelectedStep}
        selectedStep={selectedStep}
      />
      <div className="font-primary font-bold text-2xl mt-4 mb-4">Detail and Action</div>
      <InspectionStep
        selectedStep={selectedStep}
        setSelectedStep={setSelectedStep}
        currentStatus={importRequest?.status as string}
      />
    </div>
  );
};

export default IRProcessAndAction;
