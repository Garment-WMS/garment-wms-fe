import React, { useState } from 'react';
import Process from './Process';
import { useSelector } from 'react-redux';

import InspectionStep from './Actions/Inspection';
import exportRequestSelector from '../slice/selector';
import { MaterialExportRequest } from '@/types/exportRequest';

interface Props {
  onApproval: () => void;
}

const IRProcessAndAction: React.FC<Props> = ({ onApproval }) => {
  const exportRequest: MaterialExportRequest = useSelector(exportRequestSelector.exportRequest);
  const getStatusIndex = (status: any) => {
    switch (status) {
      case 'REJECTED':
      case 'APPROVED':
      case 'PENDING':
        return 1;
      case 'CANCELLED':
        return 0;
      case 'EXPORTED':
        return 3;
      case 'EXPORTING':
        return 2;
      case 'AWAIT_TO_EXPORT':
        return 2;
      case 'PRODUCTION_APPROVED':
        return 3;
      case 'PRODUCTION_REJECTED':
        return 3;

      default:
        return 0;
    }
  };
  const [selectedStep, setSelectedStep] = useState<number | null>(
    getStatusIndex(exportRequest?.status)
  ); // State for the selected step
  return (
    <div className="w-full bg-white rounded-xl shadow-sm border-2 p-4">
      <Process
        currentStatus={exportRequest?.status as string}
        setSelectedStep={setSelectedStep}
        selectedStep={selectedStep}
      />
      <div className="font-primary font-bold text-2xl mt-4 mb-4">Detail and Action</div>
      <InspectionStep
        selectedStep={selectedStep}
        setSelectedStep={setSelectedStep}
        currentStatus={exportRequest?.status as string}
        onApproval={onApproval}
      />
    </div>
  );
};

export default IRProcessAndAction;
