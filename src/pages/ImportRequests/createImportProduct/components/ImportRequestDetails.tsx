import React, { useEffect, useMemo, useState } from 'react';
import { getProductColumns } from './MaterialColumns';
import DataTable from '@/components/common/EditableTable/DataTable';
import { Button } from '@/components/ui/button';
import { PODeliveryDetail } from '@/types/PurchaseOrder';
import { useToast } from '@/hooks/use-toast';
import { boolean } from 'zod';
type Props = {
  data: PODeliveryDetail[] | undefined;
  setPoDeliverydetails: React.Dispatch<React.SetStateAction<PODeliveryDetail[]>>;
  setEditDetail: React.Dispatch<React.SetStateAction<Boolean>>;
  isEditDetail: Boolean;
};

const ImportRequestDetails = ({
  data,
  setPoDeliverydetails,
  setEditDetail,
  isEditDetail
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
  const [isError, setError] = useState(boolean);

  // Use effect to update details when data changes
  useEffect(() => {
    setDetails(initializeDetails(data));
  }, [data]);
  const handleToogleDialog = () => {
    if (initializeDetails(data).length <= 0) {
      toast({
        variant: 'destructive',
        title: 'Please choose a Purchase Order and Purchase Order batch first',
        description: ''
      });
    } else if (isEditDetail) {
      setDetails(initializeDetails(data)); // Reset details to the original data, handling undefined case
      setEditDetail(false);
    } else {
      setEditDetail(true);
    }
  };
  const handleSave = () => {
    if(!isError){
      setEditDetail(false);
    setPoDeliverydetails(details);
    }else {
      toast({
        variant: 'destructive',
        title: 'Please handle error',
        description: 'Please resolve all the error before saving the details'
      });
    }
    
  };
  const columns = useMemo(() => getProductColumns({}), []);
  return (
    <div className="px-4">
      <div className="flex flex-col gap-4">
        <div className="font-primary font-bold text-xl mb-4">Import Request Details</div>
      </div>

      <div className="flex justify-end mb-4">
        {isEditDetail && (
          <Button className="mr-4" onClick={handleSave}>
            Save
          </Button>
        )}
        <Button onClick={handleToogleDialog}>{isEditDetail ? 'Cancel' : 'Edit'}</Button>
      </div>

      {details && (
        <DataTable data={details} columns={columns} isEdit={isEditDetail} setDetails={setDetails} setError={setError} />
      )}
    </div>
  );
};

export default ImportRequestDetails;
