import React, { useEffect, useMemo, useState } from 'react';
import { getMaterialColumns } from './MaterialColumns';
import DataTable from '@/components/common/EditableTable/DataTable';
import { Button } from '@/components/ui/button';
import { PODeliveryDetail } from '@/types/purchaseOrder';
import { useToast } from '@/hooks/use-toast';
import { boolean } from 'zod';
type Props = {
  isNewPoDelivery: boolean;
  setIsNewdelivery: any;
  data: PODeliveryDetail[] | undefined;
  setPoDeliverydetails: React.Dispatch<React.SetStateAction<PODeliveryDetail[]>>;
  setEditDetail: React.Dispatch<React.SetStateAction<Boolean>>;
  isEditDetail: Boolean;
  selectedPoDelivery: any;
};

const ImportRequestDetails = ({
  selectedPoDelivery,
  isNewPoDelivery,
  data,
  setPoDeliverydetails,
  setEditDetail,
  isEditDetail,
  setIsNewdelivery
}: Props) => {
  const { toast } = useToast();
  const initializeDetails = (data: PODeliveryDetail[] | undefined) => {
    // Map through the data and add plannedQuantity and actualQuantity fields
    return (data || []).map((item) => ({
      ...item,
      plannedQuantity: item.quantityByPack, // Default value, you can modify this as needed
      actualQuantity: item.quantityByPack // Default value, you can modify this as needed
    }));
  };
  const [details, setDetails] = useState(initializeDetails(data));
  const [initialDetails, setInitialDetails] = useState(initializeDetails(data));
  const [isError, setError] = useState(false);
  useEffect(() => {
    if (isNewPoDelivery) {
      const newDetails = initializeDetails(data);
      setDetails(newDetails);
      setInitialDetails(newDetails);
      setIsNewdelivery(false);
    }
  }, [data]);

  const handleToogleDialog = () => {
    if (initialDetails.length <= 0) {
      toast({
        variant: 'destructive',
        title: 'Please choose a Purchase Order and Purchase Order batch first',
        description: ''
      });
    } else if (isEditDetail) {
      setDetails(initialDetails); // Reset to initial details when cancelling
      setEditDetail(false);
    } else {
      setEditDetail(true);
    }
  };
  const handleSave = () => {
    if (!isError) {
      setEditDetail(false);
      setPoDeliverydetails(details);
      setInitialDetails(details); // Update initialDetails with the new saved state
    } else {
      toast({
        variant: 'destructive',
        title: 'Please handle error',
        description: 'Please resolve all the error before saving the details'
      });
    }
  };

  const columns = useMemo(() => getMaterialColumns({}), []);
  return (
    <div className="px-4">
      <div className="flex flex-col gap-4">
        <div className="font-primary font-bold text-xl mb-4">Import Request Details</div>
      </div>
      {selectedPoDelivery && !selectedPoDelivery.isExtra && (
        <div className="flex justify-end mb-4">
          {isEditDetail && (
            <Button className="mr-4" onClick={handleSave}>
              Save
            </Button>
          )}
          <Button onClick={handleToogleDialog}>{isEditDetail ? 'Cancel' : 'Edit'}</Button>
        </div>
      )}

      {details && (
        <DataTable
          data={details}
          columns={columns}
          isEdit={isEditDetail}
          setDetails={setDetails}
          setError={setError}
        />
      )}
    </div>
  );
};

export default ImportRequestDetails;
