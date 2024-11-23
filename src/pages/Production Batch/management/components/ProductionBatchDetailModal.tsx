import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/Dialog';
import { useState } from 'react';
import { ProductionBatchDetails } from './ProductionBatchDetails';
import { useGetProductionBatchById } from '@/hooks/useGetProductionBatchById';
import Loading from '@/components/common/Loading';

interface ProductionBatchDetailsModalProps {
  batchId: string | null;
}

export const ProductionBatchDetailsModal: React.FC<ProductionBatchDetailsModalProps> = ({
  batchId
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: batchData, isPending } = useGetProductionBatchById(batchId || '');

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <span className="text-primaryLight underline font-semibold cursor-pointer">
          {batchData?.data?.code || 'View Details'}
        </span>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Production Batch Details</DialogTitle>
          <DialogDescription>
            {batchData?.data?.code
              ? `Detailed information about production batch ${batchData.data.code}`
              : 'Loading...'}
          </DialogDescription>
        </DialogHeader>
        {isPending ? (
          <div className="flex justify-center items-center py-6">
            <Loading />
          </div>
        ) : (
          batchData && <ProductionBatchDetails data={batchData.data} />
        )}
      </DialogContent>
    </Dialog>
  );
};
