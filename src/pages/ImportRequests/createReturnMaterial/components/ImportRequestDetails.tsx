import React, { useEffect, useMemo, useState } from 'react';
import { getMaterialColumns } from './MaterialColumns';
import DataTable from '@/components/common/EditableTable/DataTable';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

type MaterialExportRequestDetail = {
  id: string;
  materialVariantId: string;
  quantityByUom: number;
  materialVariant: {
    id: string;
    name: string;
    code: string;
    material: {
      materialUom: {
        uomCharacter: string;
      };
    };
  };
};

type Props = {
  isNewPoDelivery: boolean;
  setIsNewdelivery: (value: boolean) => void;
  data: MaterialExportRequestDetail[] | undefined;
  setPoDeliverydetails: React.Dispatch<React.SetStateAction<MaterialExportRequestDetail[]>>;
  setEditDetail: React.Dispatch<React.SetStateAction<boolean>>;
  isEditDetail: boolean;
  selectedRequest: any;
};

const ImportRequestDetails = ({
  selectedRequest,
  isNewPoDelivery,
  data,
  setPoDeliverydetails,
  setEditDetail,
  isEditDetail,
  setIsNewdelivery
}: Props) => {
  const { toast } = useToast();

  const initializeDetails = (data: MaterialExportRequestDetail[] | undefined) => {
    return (data || []).map((item) => ({
      ...item,
      plannedQuantity: item.quantityByUom,
      actualQuantity: item.quantityByUom
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
      setEditDetail(false);
    }
  }, [data, isNewPoDelivery, setIsNewdelivery, setEditDetail]);

  const handleToggleDialog = () => {
    if (initialDetails.length <= 0) {
      toast({
        variant: 'destructive',
        title: 'Please choose a Material Export Request first',
        description: ''
      });
    } else if (isEditDetail) {
      setDetails(initialDetails);
      setEditDetail(false);
    } else {
      setEditDetail(true);
    }
  };

  const handleSave = () => {
    const emptyQuantities = details.filter((detail) => !detail.actualQuantity);
    const allEmpty = emptyQuantities.length === details.length;
    const isHavingValue = details.some((detail) => detail.actualQuantity !== 0);

    if (allEmpty || !isHavingValue) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'All actual quantities are empty. Please fill in at least one actual quantity.'
      });
    } else if (emptyQuantities.length > 0) {
      toast({
        variant: 'destructive',
        title: 'Warning',
        description: `${emptyQuantities.length} item(s) have empty actual quantities. Please fill in all actual quantities or remove empty items.`
      });
    } else if (isError) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please resolve all errors before saving the details.'
      });
    } else {
      setEditDetail(false);
      setPoDeliverydetails(details);
      setInitialDetails(details);
      toast({
        variant: 'default',
        title: 'Success',
        description: 'Details saved successfully.'
      });
    }
  };

  const columns = useMemo(() => getMaterialColumns({}), []);

  return (
    <div className="px-4">
      <div className="flex flex-col gap-4">
        <div className="font-primary font-bold text-xl mb-4">Import Request Details</div>
      </div>

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
