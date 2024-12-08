'use client';

import { useEffect, useState } from 'react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/Dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/Badge';
import { Edit } from 'lucide-react';
import { ProductionBatch } from '@/types/ProductionBatch';
import { ColumnFiltersState, PaginationState, SortingState } from '@tanstack/react-table';
import { getAllProductionBatch } from '@/api/services/productionBatch';
import { useDebounce } from '@/hooks/useDebouce';
import Loading from '@/components/common/Loading';
import { useParams } from 'react-router-dom';

export interface Props {
  selectedProductionBatch: ProductionBatch | null;
  setSelectedProductionBatch: (batch: ProductionBatch | null) => void;
}

function SelectionSummary({
  selectedProductionBatch,
  onEdit
}: {
  selectedProductionBatch: ProductionBatch | null;
  onEdit: () => void;
}) {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <h2>Current Selections</h2>
          <Button onClick={onEdit} className="text-sm">
            {selectedProductionBatch ? 'Edit' : 'Select'}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between items-center">
          <span>Production Batch:</span>
          {selectedProductionBatch ? (
            <Badge variant="outline" className="flex items-center gap-2">
              {selectedProductionBatch.name}
              <Button variant="ghost" size="sm" className="h-4 w-4 p-0" onClick={onEdit}>
                <Edit className="h-3 w-3" />
                <span className="sr-only">Edit Production Batch</span>
              </Button>
            </Badge>
          ) : (
            <span className="text-muted-foreground">Not selected</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function WarehouseImportDialog({
  selectedProductionBatch,
  setSelectedProductionBatch
}: Props) {
  const params = useParams();
  const batchId = params.id as string;

  const [isOpen, setIsOpen] = useState(false);
  const [productionBatches, setProductionBatches] = useState<ProductionBatch[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([
    { id: 'status', value: 'MANUFACTURING' }
  ]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 500
  });

  const debouncedColumnFilters = useDebounce(columnFilters, 1000);
  const debouncedSorting = useDebounce(sorting, 1000);

  useEffect(() => {
    const fetchAllProductionBatch = async () => {
      setLoading(true);
      try {
        const res = await getAllProductionBatch({
          pagination,
          sorting: debouncedSorting,
          columnFilters: debouncedColumnFilters
        });
        const filteredBatches = res.data.filter(
          (batch) =>
            !batch.importRequest?.some((importRequest) => importRequest.status !== 'CANCELLED')
        );
        setProductionBatches(filteredBatches);

        if (batchId) {
          const preSelectedBatch = filteredBatches.find((batch) => batch.id === batchId);
          if (preSelectedBatch) {
            setSelectedProductionBatch(preSelectedBatch);
          }
        }
      } catch (error) {
        console.error('Error fetching production batches:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllProductionBatch();
  }, [batchId, setSelectedProductionBatch, pagination, debouncedSorting, debouncedColumnFilters]);

  const handleChooseStep = () => {
    setIsOpen(true);
  };

  const handleNext = (selectedBatch: ProductionBatch | null) => {
    setIsOpen(false);
    setSelectedProductionBatch(selectedBatch);
  };

  const handleSelectProductionBatch = (batch: ProductionBatch) => {
    setSelectedProductionBatch(batch);
  };

  const renderStepContent = () => {
    const getStatusColor = (status: string) => {
      switch (status) {
        case 'MANUFACTURING':
          return 'bg-blue-500';
        case 'COMPLETED':
          return 'bg-green-500';
        case 'CANCELLED':
          return 'bg-red-500';
        default:
          return 'bg-gray-500';
      }
    };

    if (isLoading) {
      return (
        <div className="flex justify-between items-center h-[300px]">
          <Loading />
        </div>
      );
    }

    return (
      <ScrollArea className="h-[400px] rounded-md border p-2 my-4">
        {productionBatches.length > 0 ? (
          productionBatches.map((batch) => (
            <Card
              key={batch.id}
              className={`mb-4 p-4 rounded-lg ${
                batch.status !== 'MANUFACTURING'
                  ? 'bg-muted cursor-not-allowed'
                  : selectedProductionBatch?.id === batch.id
                    ? 'bg-primary text-white cursor-pointer'
                    : 'bg-secondary cursor-pointer'
              }`}
              onClick={() =>
                batch.status === 'MANUFACTURING' && handleSelectProductionBatch(batch)
              }>
              <CardHeader>
                <div className="flex justify-between items-center gap-4">
                  <div>
                    <CardTitle className="text-2xl">{batch.name}</CardTitle>
                    <CardDescription>{batch.code || 'No code assigned'}</CardDescription>
                  </div>
                  <Badge className={`${getStatusColor(batch.status)} text-white`}>
                    {batch.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold">Quantity to Produce</h3>
                    <p>
                      {batch.quantityToProduce}{' '}
                      {
                        batch.productionPlanDetail?.productSize?.productVariant?.product?.productUom
                          ?.uomCharacter
                      }
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Production Plan Code</h3>
                    <p>{batch.productionPlanDetail?.code || 'No code available'}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Product Details</h3>
                  <div className="flex items-center space-x-4">
                    <img
                      src={
                        batch?.productionPlanDetail?.productSize?.productVariant?.image ||
                        'placeholder.jpg'
                      }
                      alt={
                        batch?.productionPlanDetail?.productSize?.productVariant?.name ||
                        'Product Image'
                      }
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                      <p className="font-medium">
                        {batch?.productionPlanDetail?.productSize?.productVariant?.product?.name}
                      </p>
                      <p>{batch?.productionPlanDetail?.productSize?.productVariant?.name}</p>
                      <p>Size: {batch?.productionPlanDetail?.productSize?.size}</p>
                    </div>
                  </div>
                </div>

                {batch.description && (
                  <div>
                    <h3 className="font-semibold">Description</h3>
                    <p>{batch.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="flex justify-center items-center">
            No production batch available at the moment
          </div>
        )}
      </ScrollArea>
    );
  };

  return (
    <div className="space-y-4">
      <SelectionSummary
        selectedProductionBatch={selectedProductionBatch}
        onEdit={handleChooseStep}
      />

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="w-full">
          <DialogHeader>
            <DialogTitle>Select Production Batch</DialogTitle>
          </DialogHeader>
          <div className="w-full">{renderStepContent()}</div>

          <DialogFooter className="flex justify-between">
            <Button
              onClick={() => handleNext(selectedProductionBatch)}
              disabled={!selectedProductionBatch}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
