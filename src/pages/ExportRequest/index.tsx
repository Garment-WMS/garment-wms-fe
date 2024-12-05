'use client';

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { createMaterialExportRequest } from '@/api/services/exportRequestApi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/Dialog';
import ProductionBatchSelectionDialog from './ProductionBatchSelectionDialog';
import { ProductionBatchSummary } from './ProductionBatchSummary';
import { ProductionBatch } from '@/types';

interface Material {
  id: number;
  materialVariant: {
    id: number;
    name: string;
    code: string;
    image?: string;
    material: {
      code: string;
      materialUom: {
        uomCharacter: string;
      };
    };
  };
  quantityByUom: number;
}

export default function ExportMaterialPage() {
  const [selectedBatch, setSelectedBatch] = useState<ProductionBatch | null>(null);
  const [productQuantity, setProductQuantity] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exportDescription, setExportDescription] = useState('');
  const [isCreatingExportRequest, setIsCreatingExportRequest] = useState(false);
  const [isProductionBatchDialogOpen, setIsProductionBatchDialogOpen] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (selectedBatch) {
      setProductQuantity(selectedBatch.quantityToProduce);
    }
  }, [selectedBatch]);

  const handleQuantityChange = (quantity: number) => {
    setProductQuantity(Math.max(0, quantity));
  };

  const getTotalMaterials = () => {
    const totals: Record<string, { amount: number; unit: string }> = {};

    if (selectedBatch) {
      selectedBatch.productionBatchMaterialVariant.forEach((material: Material) => {
        const totalAmount = material.quantityByUom;
        const materialName = material.materialVariant.name;
        const unit = material.materialVariant.material.materialUom.uomCharacter;
        if (totals[materialName]) {
          totals[materialName].amount += totalAmount;
        } else {
          totals[materialName] = { amount: totalAmount, unit };
        }
      });
    }

    return totals;
  };

  const openProductionBatchDialog = () => {
    setIsProductionBatchDialogOpen(true);
  };

  const handleSelectBatch = (batch: ProductionBatch) => {
    setSelectedBatch(batch);
    setIsProductionBatchDialogOpen(false);
  };

  const handleConfirmExport = () => {
    setShowConfirmDialog(true);
  };

  const handleCancelExport = () => {
    setShowConfirmDialog(false);
  };

  const handleConfirmedExport = () => {
    setShowConfirmDialog(false);
    handleCreateExportRequest();
  };

  const handleCreateExportRequest = async () => {
    if (!selectedBatch) {
      setError('Please select a production batch');
      return;
    }

    setIsCreatingExportRequest(true);
    try {
      const materialExportRequestDetail = selectedBatch.productionBatchMaterialVariant.map(
        (material: Material) => ({
          materialVariantId: material.materialVariant.id,
          quantityByUom: material.quantityByUom * productQuantity
        })
      );
      const response = await createMaterialExportRequest(
        selectedBatch.id,
        exportDescription,
        materialExportRequestDetail,
        'custom'
      );

      if (response.statusCode === 201) {
        const id = response.data.id;
        toast({
          variant: 'success',
          title: 'Export request created',
          description: 'Your material export request has been successfully created.'
        });
        navigate(`/export-request/${id}`);
      } else {
        throw new Error('Unexpected status code: ' + response.statusCode);
      }
    } catch (error) {
      if (error instanceof Error) {
        toast({
          variant: 'destructive',
          title: 'Failed to create export request',
          description: error.message || 'An unexpected error occurred. Please try again.'
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Failed to create export request',
          description: 'An unexpected error occurred. Please try again.'
        });
      }
    } finally {
      setIsCreatingExportRequest(false);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Export Materials</h1>

      <ProductionBatchSummary selectedBatch={selectedBatch} onEdit={openProductionBatchDialog} />

      <ProductionBatchSelectionDialog
        isOpen={isProductionBatchDialogOpen}
        onOpen={openProductionBatchDialog}
        onClose={() => setIsProductionBatchDialogOpen(false)}
        onSelectBatch={handleSelectBatch}
        selectedBatch={selectedBatch}
      />

      {selectedBatch && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Product Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="product-name">Product Name</Label>
                <Input
                  id="product-name"
                  value={selectedBatch.productionPlanDetail.productSize.productVariant.name}
                  readOnly
                />
              </div>
              <div>
                <Label htmlFor="product-size">Size</Label>
                <Input
                  id="product-size"
                  value={selectedBatch.productionPlanDetail.productSize.name}
                  readOnly
                />
              </div>
              <div>
                <Label htmlFor="product-quantity">Quantity</Label>
                <Input
                  id="product-quantity"
                  type="number"
                  readOnly
                  value={productQuantity}
                  onChange={(e) => handleQuantityChange(parseInt(e.target.value, 10))}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {selectedBatch && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Materials required for Production Batch</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Material</TableHead>
                  <TableHead>Material Code</TableHead>
                  <TableHead>Variant Code</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Unit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedBatch.productionBatchMaterialVariant.map((material: Material) => (
                  <TableRow key={material.id}>
                    <TableCell className="flex items-center space-x-2">
                      <img
                        src={material.materialVariant.image || '/placeholder.svg'}
                        alt={material.materialVariant.name}
                        className="rounded-full w-10 h-10"
                      />
                      <span>{material.materialVariant.name}</span>
                    </TableCell>
                    <TableCell>{material.materialVariant.material.code}</TableCell>
                    <TableCell>{material.materialVariant.code}</TableCell>
                    <TableCell>{material.quantityByUom}</TableCell>
                    <TableCell>
                      {material.materialVariant.material.materialUom.uomCharacter}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {selectedBatch && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Export request summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Object.entries(getTotalMaterials()).map(([name, { amount, unit }]) => (
                <Badge key={name} variant="secondary" className="p-2 text-sm">
                  {name}: {amount.toFixed(2)} {unit}
                </Badge>
              ))}
            </div>

            <div className="space-y-4 mt-4">
              <div>
                <Label htmlFor="export-description">Description</Label>
                <Textarea
                  id="export-description"
                  placeholder="Enter a description for this export request"
                  value={exportDescription}
                  onChange={(e) => setExportDescription(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardFooter className="flex justify-between items-center pt-6">
          <Button variant="outline" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmExport}
            disabled={isCreatingExportRequest || !selectedBatch}>
            Create Material Request
          </Button>
        </CardFooter>
      </Card>

      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Export Request</DialogTitle>
            <DialogDescription>
              Are you sure you want to create this material export request?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelExport}>
              Cancel
            </Button>
            <Button onClick={handleConfirmedExport} disabled={isCreatingExportRequest}>
              {isCreatingExportRequest ? 'Creating...' : 'Confirm'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
