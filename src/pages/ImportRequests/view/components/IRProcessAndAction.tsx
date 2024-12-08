import React, { useState } from 'react';
import Process from './Process';
import { useSelector } from 'react-redux';
import importRequestSelector from '../../slice/selector';
import { ImportRequest } from '@/types/ImportRequestType';
import InspectionStep from './Actions/Inspection';

interface Props {
  onApproval: () => void;
}

const IRProcessAndAction: React.FC<Props> = (props) => {
  const importRequest: ImportRequest = useSelector(importRequestSelector.importRequest);
  const getStatusIndex = (status: ImportRequest['status']) => {
    switch (status) {
      case 'REJECTED':
      case 'APPROVED':
      case 'ARRIVED':
        return 1;
      case 'CANCELLED':
        return 0;
      case 'IMPORTED':
        return 3;
      case 'INSPECTING':
        return 2;
      case 'IMPORTING':
        return 3;
      case 'AWAIT_TO_IMPORT':
        return 3;
      default:
        return 0;
    }
  };
  const [selectedStep, setSelectedStep] = useState<number | null>(
    getStatusIndex(importRequest?.status)
  ); // State for the selected step

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
        onApproval={props.onApproval}
      />
    </div>
  );
};

export default IRProcessAndAction;
