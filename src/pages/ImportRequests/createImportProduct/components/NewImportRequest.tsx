'use client';

import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { importRequestApi } from '@/api/services/importRequestApi';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/AlertDialog';
import { Button } from '@/components/ui/button';
import WarehouseImportDialog from './WarehouseImportDialog';
import { ProductionBatch } from '@/types/ProductionBatch';
import ProductImportDetail from './ProductImportDetail';
import { Textarea } from '@/components/ui/Textarea';
import { Label } from '@/components/ui/Label';
import Loading from '@/components/common/Loading';
import { useNavigate } from 'react-router-dom';
import privateCall from '@/api/PrivateCaller';

const deliveryFormSchema = z.object({
  description: z.string().optional()
});

const formSchema = z.object({
  number: z
    .number({
      required_error: 'Number is required',
      invalid_type_error: 'Number must be a valid number'
    })
    .int('Number must be an integer')
    .positive('Number must be positive')
    .lte(10000, 'Number must be less than or equal to 10000')
});

const NewImportRequest = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedProductionBatch, setSelectedProductionBatch] = useState<ProductionBatch | null>(
    null
  );
  const [description, setDescription] = useState<string>('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(event.target.value);
  };

  const onSubmit = async () => {
    try {
      if (!selectedProductionBatch) {
        toast({
          variant: 'destructive',
          title: 'Please choose a Production Batch',
          description: ''
        });
        return;
      }
      setIsLoading(true);
      const response = await privateCall(
        importRequestApi.createImportProduct({
          productionBatchId: selectedProductionBatch.id,
          description: description,
          importRequestDetail: {
            productSizeId: selectedProductionBatch.productionPlanDetail?.productSize.id,
            quantityByPack: selectedProductionBatch.quantityToProduce
          },
          type: 'PRODUCT_BY_BATCH'
        })
      );
      if (response.status === 201) {
        const responseData = response.data.data.data;
        toast({
          variant: 'success',
          title: 'Import Request created successfully',
          description: 'Import request for Material has been created successfully in the system'
        });
        navigate(`/import-request/${responseData.id}`);
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: error.message || 'There was a problem with your request.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = () => {
    onSubmit();
    setDialogOpen(false);
  };

  if (isLoading) {
    return (
      <div className="w-full h-screen pt-4 flex flex-col justify-center items-center gap-4">
        <Loading />
      </div>
    );
  }

  return (
    <div className="w-full pt-4 flex flex-col gap-4">
      <div className="font-extrabold font-primary flex justify-center text-bluePrimary text-md md:text-3xl">
        NEW PRODUCT IMPORT REQUEST
      </div>
      <div className="w-full px-4">
        <div className="flex flex-col gap-4">
          <div className="font-primary font-bold text-xl mb-4">Product Batch</div>
          <WarehouseImportDialog
            selectedProductionBatch={selectedProductionBatch}
            setSelectedProductionBatch={setSelectedProductionBatch}
          />
        </div>
      </div>
      <div className="w-full px-4">
        <Label>Notes</Label>
        <Textarea onChange={handleDescriptionChange} placeholder="Type your message here." />
      </div>
      {selectedProductionBatch ? (
        <ProductImportDetail selectedProductionBatch={selectedProductionBatch} />
      ) : (
        <div className="flex justify-center items-center">
          <h1>Choose the production batch first</h1>
        </div>
      )}

      <div className="flex justify-center items-center pb-4">
        <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <AlertDialogTrigger asChild>
            <Button type="button">Create Import Request</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Import Request Creation</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to create this import request? Please review the details
                before proceeding. Once submitted, the request will be processed and cannot be
                modified.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleFormSubmit} type="submit">
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default NewImportRequest;
