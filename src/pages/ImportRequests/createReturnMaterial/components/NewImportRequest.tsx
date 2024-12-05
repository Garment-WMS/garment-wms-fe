'use client';

import { useEffect, useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
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
import DeliveryForm from './DeliveryForm';
import ImportRequestDetails from './ImportRequestDetails';
import WarehouseImportDialog from './WarehouseImportDialog';
import Loading from '@/components/common/Loading';
import { importRequestApi, returnMaterialFn } from '@/api/purchase-staff/importRequestApi';

const deliveryFormSchema = z.object({
  deliveryDate: z.date({
    required_error: 'A date of delivery is required.'
  }),
  description: z.string().optional()
});

const NewImportRequest = () => {
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof deliveryFormSchema>>({
    resolver: zodResolver(deliveryFormSchema),
    defaultValues: {
      deliveryDate: undefined,
      description: ''
    }
  });

  const [isEditDetail, setEditDetail] = useState<Boolean>(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [poDeliveryDetails, setPoDeliverydetails] = useState<any[]>([]);
  const [isNewPoDelivery, setIsNewdelivery] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { id } = useParams();

  const onSubmit = async (data: z.infer<typeof deliveryFormSchema>) => {
    try {
      if (isEditDetail) {
        toast({
          variant: 'destructive',
          title: 'Please save the Delivery Details before submitting!'
        });
        return;
      }
      setIsLoading(true);

      const response = await returnMaterialFn(selectedRequest.id);
      if (response.statusCode === 201) {
        const id = response.data.id;
        toast({
          variant: 'success',
          title: 'Import Request created successfully',
          description: 'Import request for Material has been created successfully in the system'
        });
        navigate(`/import-request/${id}`);
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

  useEffect(() => {}, [poDeliveryDetails]);

  const handleFormSubmit = () => {
    form.handleSubmit(onSubmit)();
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
        NEW MATERIAL IMPORT REQUEST
      </div>
      <div className="w-full px-4">
        <div className="flex flex-col gap-4">
          <div className="font-primary font-bold text-xl mb-4">Delivery</div>
          <WarehouseImportDialog
            defaultRequestId={id}
            setIsNewdelivery={setIsNewdelivery}
            selectedRequest={selectedRequest}
            setSelectedRequest={setSelectedRequest}
            setPoDeliverydetails={setPoDeliverydetails}
          />
          <DeliveryForm form={form} onSubmit={onSubmit} />
        </div>
      </div>

      <ImportRequestDetails
        selectedRequest={selectedRequest}
        isNewPoDelivery={isNewPoDelivery}
        setIsNewdelivery={setIsNewdelivery}
        data={poDeliveryDetails}
        setPoDeliverydetails={setPoDeliverydetails}
        setEditDetail={setEditDetail}
        isEditDetail={isEditDetail}
      />

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
