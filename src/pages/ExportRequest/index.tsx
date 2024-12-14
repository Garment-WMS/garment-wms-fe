'use client';

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import {
  createMaterialExportRequest,
  checkQuantityByVariantFn
} from '@/api/services/exportRequestApi';
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
import { ProductionBatch } from '@/types/ProductionBatch';
import { AiOutlineCheckCircle } from 'react-icons/ai';
import { MdOutlineWarningAmber } from 'react-icons/md';
import { AlertTriangle, Check, CheckCircle } from 'lucide-react';

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
  const [showWarningDialog, setShowWarningDialog] = useState(false);
  const [materialStatuses, setMaterialStatuses] = useState<Record<string, any>>({});
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (selectedBatch) {
      setProductQuantity(selectedBatch.quantityToProduce);
      fetchMaterialStatuses(selectedBatch.productionBatchMaterialVariant);
    }
  }, [selectedBatch]);

  const handleQuantityChange = (quantity: number) => {
    setProductQuantity(Math.max(0, quantity));
  };

  const fetchMaterialStatuses = async (materials: Material[]) => {
    const statuses: Record<string, any> = {};
    setIsLoading(true);

    try {
      await Promise.all(
        materials.map(async (material) => {
          try {
            const response = await checkQuantityByVariantFn(
              material.materialVariant.id,
              material.quantityByUom
            );
            statuses[material.materialVariant.id] = response;
          } catch (error) {
            statuses[material.materialVariant.id] = { error: true };
          }
        })
      );
      setMaterialStatuses(statuses);
    } catch (error) {
      console.error('Error fetching material statuses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const hasInsufficientMaterials = () => {
    return Object.values(materialStatuses).some(
      (status) => status?.data && !status.data.isFullFilled
    );
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
    if (hasInsufficientMaterials()) {
      setShowWarningDialog(true);
    } else {
      setShowConfirmDialog(true);
    }
  };

  const handleCancelExport = () => {
    setShowConfirmDialog(false);
    setShowWarningDialog(false);
  };

  const handleConfirmedExport = () => {
    setShowConfirmDialog(false);
    setShowWarningDialog(false);
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
                  <TableHead>Condition</TableHead>
                  <TableHead>Required</TableHead>
                  <TableHead>Remain</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedBatch.productionBatchMaterialVariant.map((material: Material) => {
                  const status = materialStatuses[material.materialVariant.id];
                  const isFullFilled = status?.data?.isFullFilled;

                  return (
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
                      <TableCell className="text-lg text-slate-700">
                        {material.quantityByUom}
                      </TableCell>
                      <TableCell>
                        {material.materialVariant.material.materialUom.uomCharacter}
                      </TableCell>
                      <TableCell>
                        {status ? (
                          isFullFilled ? (
                            <Check className="w-7 h-7 text-green-500" />
                          ) : (
                            <MdOutlineWarningAmber className="w-7 h-7 text-yellow-500" />
                          )
                        ) : (
                          <span>Loading...</span>
                        )}
                      </TableCell>
                      <TableCell className="text-red-600 text-lg">
                        {status?.data?.requiredQuantity || 0}
                        <span className="ml-1">*</span>
                      </TableCell>
                      <TableCell className="text-primaryLight text-lg">
                        {status?.data?.remainQuantityByPack || 0}
                        <span className="ml-1">*</span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
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

      <Dialog open={showWarningDialog} onOpenChange={setShowWarningDialog}>
        <DialogContent className="sm:max-w-[550px] w-full h-[300px] flex flex-col justify-between bg-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-yellow-600  text-lg">
              <AlertTriangle className="h-9 w-9 text-yellow-600" />
              <span className="text-lg">Warning</span>
            </DialogTitle>
            <DialogDescription className="text-gray-700 text-md">
              Some materials do not have enough stock for export. Would you like to proceed with the
              request anyway?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-between mt-4">
            <Button
              variant="outline"
              className="text-gray-700 border-gray-300 hover:bg-gray-100"
              onClick={handleCancelExport}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={handleConfirmedExport}
              disabled={isCreatingExportRequest}>
              Proceed Anyway
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="sm:max-w-[550px] w-full h-[300px] flex flex-col justify-between bg-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-gray-800  text-lg">
              <CheckCircle className="h-9 w-9 text-green-600" />
              <span className="text-lg"> Confirm Export Request</span>
            </DialogTitle>
            <DialogDescription className="text-gray-700 text-md">
              Are you sure you want to create this material export request?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-between mt-4">
            <Button
              variant="outline"
              className="text-gray-700 border-gray-300 hover:bg-gray-100"
              onClick={handleCancelExport}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirmedExport}
              disabled={isCreatingExportRequest}
              variant="default"
              className="bg-green-600 hover:bg-green-700 text-white">
              {isCreatingExportRequest ? 'Creating...' : 'Confirm'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
