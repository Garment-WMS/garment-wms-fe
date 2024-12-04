import React, { useState } from 'react';
import { useMediaQuery } from 'usehooks-ts';
import ProcessIcon from './ProcessIcon';
import { importRequestStatusList } from '../../constants';

type Props = {
  currentStatus: string;
  setSelectedStep: React.Dispatch<React.SetStateAction<number | null>>;
  selectedStep: number | null;
};

const statusOrder = [
  'ARRIVED',
  'CANCELLED',
  'REJECTED',
  'APPROVED',
  'INSPECTING',
  'INSPECTED',
  'IMPORTING',
  'IMPORTED'
];

const Process = ({ currentStatus, selectedStep, setSelectedStep }: Props) => {
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  const getDisplayStatus = (itemStates: string[]) => {
    const currentStatusIndex = statusOrder.indexOf(currentStatus);
    return (
      itemStates.find((state) => statusOrder.indexOf(state) <= currentStatusIndex) || 'NOT YET'
    );
  };

  const handleSelectStep = (index: number) => {
    setSelectedStep(index); // Update the selected step when clicked
  };

  return (
    <div className="flex flex-col gap-4 w-full ">
      <div className="font-primary font-bold text-2xl mb-4">Process</div>
      <ol
        className={
          isDesktop ? 'flex items-center w-full text-xs sm:text-base' : 'overflow-hidden space-y-8'
        }>
        {importRequestStatusList.map((item, index) => (
          <ProcessIcon
            key={index}
            index={index}
            title={item.title}
            state={item.state}
            displayStatus={getDisplayStatus(item.state)}
            isDone={
              statusOrder.indexOf(currentStatus) >=
              statusOrder.indexOf(item.state[item.state.length - 1])
            }
            totalSteps={importRequestStatusList.length}
            onSelect={handleSelectStep} // Pass the selection handler
            isSelected={selectedStep === index} // Pass whether this step is selected
          />
        ))}
      </ol>
    </div>
  );
};

export default Process;
