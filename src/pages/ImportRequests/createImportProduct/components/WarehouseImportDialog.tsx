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
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/Badge';
import { CheckCircle, AlertCircle, ChevronLeft, ChevronRight, Edit, CalendarIcon } from 'lucide-react';
import { getAllProductionPlanFn } from '@/api/services/productionPlanApi';
import {  ProductionPlanDetail } from '@/types/ProductionPlan';
import Loading from '@/components/common/Loading';
import { PoDeliveryStatus } from '@/types/tempFile';
import { ProductionBatch } from '@/types/ProductionBatch';
import { ColumnFilter, ColumnFiltersState, PaginationState, SortingState } from '@tanstack/react-table';
import { getAllProductionBatch } from '@/api/services/productionBatch';
import { useDebounce } from '@/hooks/useDebouce';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { convertDate, formatDateTimeToDDMMYYYYHHMM } from '@/helpers/convertDate';
import { ClockIcon } from '@radix-ui/react-icons';
export interface Props {
  selectedPlanDetails: any;
  setSelectedPlanDetails: any;
  selectedProductionBatch: any;
  setSelectedProductionBatch: any;
}
function SelectionSummary({
  selectedProductionBatch,
  onEdit
}: {
  selectedProductionBatch: ProductionBatch | null;
  onEdit: (step: number) => void;
}) {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <h2>Current Selections</h2>
          <Button onClick={() => onEdit(1)} className="text-sm">
            {selectedProductionBatch ? 'Edit' : 'Select'}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between items-center">
          <span>Production Batch:</span>
          {selectedProductionBatch ? (
            <Badge variant="outline" className="flex items-center gap-2">
              {selectedProductionBatch?.name} 
              <Button variant="ghost" size="sm" className="h-4 w-4 p-0" onClick={() => onEdit(3)}>
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
  setSelectedProductionBatch,

}: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const [productionBatches, setProductionBatches] = useState<ProductionBatch[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  // column filters state of the table
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([{ id: 'status', value: 'MANUFACTURING' }]);

  const debouncedColumnFilters: ColumnFiltersState = useDebounce(columnFilters, 1000);

  const debouncedSorting: SortingState = useDebounce(sorting, 1000);
  // pagination state of the table
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0, //initial page index
    pageSize: 500 //default page size
  });
 
 
  useEffect(() => {
    const fetchAllProductionBatch = async () => {
      try {
        const res = await getAllProductionBatch({
          pagination,
          sorting: debouncedSorting,
          columnFilters: debouncedColumnFilters
        })
        const filteredBatches = res.data.filter(batch => batch.importRequest === null);

        setProductionBatches(filteredBatches);
      } catch (error) {
        console.error(error);
      }
    }
    fetchAllProductionBatch();
  }, []);

 const handleChooseStep = () => {
    setIsOpen(true);
  };
  const handleNext = (selectedBatch: ProductionBatch) => {
    setIsOpen(false);
    setSelectedProductionBatch(selectedBatch);
    }
  
  const handleSelectProductionBatch = (batch: ProductionBatch) => {
    setSelectedProductionBatch(batch); // Set a single batch
  };
  

  const renderStepContent = (isLoading: boolean) => {
    const getStatusColor = (status: string) => {
      switch (status) {
        case "MANUFACTURING":
          return "bg-blue-500"
        case "COMPLETED":
          return "bg-green-500"
        case "CANCELED":
          return "bg-red-500"
        default:
          return "bg-gray-500"
      }
    }
    if (isLoading) {
      return (
        <div className="flex justify-between items-center h-[300px]">
          <Loading /> {/* Assuming Loading is a spinner or similar component */}
        </div>
      );
    }
    return (
      <ScrollArea className="h-[400px] rounded-md border p-2 my-4">
        {productionBatches?.length > 0 ? (
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
              }
            >
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
                      {batch.productionPlanDetail?.productSize?.productVariant?.product?.productUom?.uomCharacter}
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
    
    }
  

  return (
    <div className="space-y-4">
      <SelectionSummary
        selectedProductionBatch={selectedProductionBatch}
        onEdit={handleChooseStep}
      />

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className=" w-full">
          <DialogHeader>
            <DialogTitle>
              Select Production Batch
            </DialogTitle>
          </DialogHeader>
          <div className='w-full'>
            {renderStepContent(isLoading)}
          </div>
          
          <DialogFooter className="flex justify-between">
            {/* <div className="flex gap-2">
              <Button variant="outline" onClick={handleBack} disabled={step === 1}>
                <ChevronLeft className="mr-2 h-4 w-4" /> Back
              </Button>
            </div> */}
            <Button
              onClick={() => handleNext(selectedProductionBatch)}
              >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
