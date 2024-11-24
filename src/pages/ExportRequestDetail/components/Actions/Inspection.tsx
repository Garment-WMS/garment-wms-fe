import React, { useEffect, useState } from 'react';
import { Chart } from './Chart';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselApi
} from '@/components/ui/Carousel';
import WarehouseApproval from './ImportRequestApproval';
import WarehouseStaffAssignment from './ImportRequestStaffAssignment';
import { useSelector } from 'react-redux';
import { ImportRequest } from '@/types/ImportRequestType';
import importRequestSelector from '@/pages/ImportRequests/slice/selector';
import ExportRequestCreation from './exportRequestCreation';
import exportRequestSelector from '../../slice/selector';
import { MaterialExportRequest } from '@/types/exportRequest';
import { useParams } from 'react-router-dom';

interface Props {
  selectedStep: number | null;
  setSelectedStep: React.Dispatch<React.SetStateAction<number | null>>;
  currentStatus: string;
  onApproval: () => void;
}

const InspectionStep: React.FC<Props> = ({
  selectedStep,
  setSelectedStep,
  currentStatus,
  onApproval
}) => {
  const exportRequest: MaterialExportRequest = useSelector(exportRequestSelector.exportRequest);
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null); // Store carousel API
  const { id } = useParams();
  // Step actions data (can be dynamic)
  const stepsActions = [
    {
      title: '123',
      content: <ExportRequestCreation />
    },

    {
      title: 'Pending Approval',
      content: (
        <WarehouseApproval
          requestId={id as string}
          currentStatus={currentStatus}
          manager={exportRequest?.warehouseManager}
          requestDetails={exportRequest?.managerNote as string}
          requestDate={exportRequest?.createdAt}
          warehouseStaff={exportRequest?.warehouseStaff}
          onApproval={onApproval}
        />
      )
    },

    {
      title: 'Pending Approval',
      content: (
        <WarehouseStaffAssignment
          currentStatus={currentStatus}
          requestId={exportRequest?.code}
          warehouseManager={exportRequest?.warehouseManager}
          warehouseStaff={exportRequest?.warehouseStaff}
          lastedUpdate={exportRequest?.updatedAt}
        />
      )
    }
  ];

  // Effect to sync the carousel with the selectedStep
  useEffect(() => {
    if (carouselApi && selectedStep !== null) {
      carouselApi.scrollTo(selectedStep); // Sync carousel with selectedStep
    }
  }, [selectedStep, carouselApi]);

  // Callback when carousel slide changes
  const onSlideChange = () => {
    if (carouselApi) {
      const newIndex = carouselApi.selectedScrollSnap(); // Get the current slide index
      setSelectedStep(newIndex); // Update selectedStep based on carousel position
    }
  };

  // Effect to listen to carousel's slide change events
  useEffect(() => {
    if (carouselApi) {
      carouselApi.on('select', onSlideChange); // Listen to carousel's slide changes

      return () => {
        carouselApi.off('select', onSlideChange); // Cleanup the listener on unmount
      };
    }
  }, [carouselApi]);

  return (
    <div className="flex items-center justify-center">
      <Carousel className="w-[90%] h-[80%]  max-w-[800px] max-h-[500px]" setApi={setCarouselApi}>
        <CarouselContent>
          {stepsActions.map((action, index) => (
            <CarouselItem key={index}>
              <div className="w-full h-full  max-w-[800px] max-h-[500px]">
                <div className="flex  items-center justify-center h-full ">{action.content}</div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default InspectionStep;
