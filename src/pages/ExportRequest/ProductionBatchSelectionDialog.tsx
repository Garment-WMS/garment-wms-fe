'use client';

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
import { ProductionBatchSummary } from './ProductionBatchSummary';

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
  const [productionBatches, setProductionBatches] = useState<ProductionBatch[]>([]);
  const [selectedBatchState, setSelectedBatchState] = useState<ProductionBatch | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProductionBatches = async () => {
      try {
        setIsLoading(true);
        const response = await getProductionBatchFn();
        setProductionBatches(response.data);
      } catch (error) {
        console.error('Error fetching production batches:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      fetchProductionBatches();
    }
  }, [isOpen]);

  const handleConfirm = () => {
    if (selectedBatchState) {
      onSelectBatch(selectedBatchState);
      onClose();
    }
  };
  function getBadgeClasses(status: string): { variant: 'default' | 'secondary'; bgClass: string } {
    switch (status) {
      case 'IMPORTING':
      case 'EXECUTING':
        return { variant: 'default', bgClass: 'bg-yellow-500' }; // Yellow for active states
      case 'FINISHED':
        return { variant: 'secondary', bgClass: 'bg-green-500' }; // Green for completed
      case 'PENDING':
        return { variant: 'secondary', bgClass: 'bg-gray-500' }; // Gray for pending
      case 'CANCELED':
        return { variant: 'secondary', bgClass: 'bg-red-500' }; // Red for canceled
      default:
        return { variant: 'secondary', bgClass: 'bg-gray-500' }; // Default gray
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
                <Loading />
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
                          Product: {batch.productionPlanDetail.productSize.productVariant.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Size: {batch.productionPlanDetail.productSize.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Quantity: {batch.quantityToProduce}
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
