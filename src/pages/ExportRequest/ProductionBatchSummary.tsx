import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/Badge';
import { Edit } from 'lucide-react';
import { ProductionBatch } from '@/types/ProductionBatch';

interface ProductionBatchSummaryProps {
  selectedBatch: ProductionBatch | null;
  onEdit: () => void;
}

export function ProductionBatchSummary({ selectedBatch, onEdit }: ProductionBatchSummaryProps) {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <h2>Production Batch</h2>
          <Button onClick={onEdit} className="text-sm">
            {selectedBatch ? 'Edit' : 'Select'}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {selectedBatch ? (
          <>
            <div className="flex justify-between items-center">
              <span>Batch:</span>
              <Badge variant="outline" className="flex items-center gap-2">
                {selectedBatch.name}
                <Button variant="ghost" size="sm" className="h-4 w-4 p-0" onClick={onEdit}>
                  <Edit className="h-3 w-3" />
                  <span className="sr-only">Edit Production Batch</span>
                </Button>
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Product:</span>
              <span className="text-muted-foreground">
                {selectedBatch.productionPlanDetail.productSize.productVariant.name}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Size:</span>
              <span className="text-muted-foreground">
                {selectedBatch.productionPlanDetail.productSize.name}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Quantity:</span>
              <span className="text-muted-foreground">{selectedBatch.quantityToProduce}</span>
            </div>
          </>
        ) : (
          <div className="text-center text-muted-foreground">No production batch selected</div>
        )}
      </CardContent>
    </Card>
  );
}
