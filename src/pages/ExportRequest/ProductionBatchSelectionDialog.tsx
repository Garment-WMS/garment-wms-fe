import * as React from 'react';
import { useState, useEffect } from 'react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/Dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/Badge';
import { getProductionBatchFn } from '@/api/services/productionBatchApi';
import { ProductionBatch } from '@/types/ProductionBatch';
import Loading from '@/components/common/Loading';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { ProductionBatchStatus } from '@/enums/productionBatch';
import EmptyDatacomponent from '@/components/common/EmptyData';

interface Props {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onSelectBatch: (batch: ProductionBatch) => void;
  selectedBatch: ProductionBatch | null;
}

export default function ProductionBatchSelectionDialog({
  isOpen,
  onOpen,
  onClose,
  onSelectBatch,
  selectedBatch
}: Props) {
  const params = useParams();
  const productionBatchId = params.id as string;

  const [productionBatches, setProductionBatches] = useState<ProductionBatch[]>([]);
  const [selectedBatchState, setSelectedBatchState] = useState<ProductionBatch | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProductionBatches = async () => {
      try {
        setIsLoading(true);
        const response = await getProductionBatchFn();
        const filteredBatches = response.data.filter(
          (batch: ProductionBatch) => batch.status === ProductionBatchStatus.PENDING
        );
        setProductionBatches(filteredBatches);
        // If a productionBatchId is provided in the URL, pre-select that batch
        if (productionBatchId) {
          const preSelectedBatch = filteredBatches.find(
            (batch: ProductionBatch) => batch.id === productionBatchId
          );
          if (preSelectedBatch) {
            setSelectedBatchState(preSelectedBatch);
            onSelectBatch(preSelectedBatch);
          }
        }
      } catch (error) {
        console.error('Error fetching production batches:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductionBatches();
  }, []);

  const handleConfirm = () => {
    if (selectedBatchState) {
      onSelectBatch(selectedBatchState);
      onClose();
    }
  };

  function getBadgeClasses(status: string): { variant: 'default' | 'secondary'; bgClass: string } {
    switch (status) {
      case 'PENDING':
        return { variant: 'default', bgClass: 'bg-yellow-500' };
      case 'FINISHED':
        return { variant: 'secondary', bgClass: 'bg-green-500' };
      case 'MANUFACTURING':
      case 'IMPORTING':
      case 'EXECUTING':
        return { variant: 'secondary', bgClass: 'bg-gray-500' };
      case 'CANCELLED':
        return { variant: 'secondary', bgClass: 'bg-red-500' };
      default:
        return { variant: 'secondary', bgClass: 'bg-gray-500' };
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}>
              <DialogHeader className="p-6 pb-4">
                <DialogTitle>Select Production Batch</DialogTitle>
              </DialogHeader>
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <Loading size="60" />
                </div>
              ) : productionBatches.length === 0 ? (
                <EmptyDatacomponent />
              ) : (
                <ScrollArea className="h-[400px] p-6 pt-0">
                  {productionBatches.map((batch) => (
                    <Card
                      key={batch.id}
                      className={cn(
                        'mb-4 cursor-pointer transition-colors',
                        selectedBatchState?.id === batch.id ? 'border-primary' : 'hover:bg-accent'
                      )}
                      onClick={() => setSelectedBatchState(batch)}>
                      <CardHeader className="flex flex-row items-center justify-between py-2">
                        <CardTitle className="text-sm font-medium">{batch.name}</CardTitle>
                        <Badge
                          className={`${getBadgeClasses(batch.status).bgClass} text-white py-1 px-3 rounded-md`}>
                          {batch.status}
                        </Badge>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Product: {batch?.productionPlanDetail?.productSize?.productVariant?.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Size: {batch?.productionPlanDetail?.productSize?.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Quantity: {batch?.quantityToProduce}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </ScrollArea>
              )}
              <DialogFooter className="p-6 pt-4">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button onClick={handleConfirm} disabled={!selectedBatchState}>
                  Confirm
                </Button>
              </DialogFooter>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
