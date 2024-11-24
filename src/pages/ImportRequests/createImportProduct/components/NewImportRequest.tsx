import { useEffect, useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
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
import DeliveryForm from './DeliveryForm';
import ImportRequestDetails from './ImportRequestDetails';
import WarehouseImportDialog from './WarehouseImportDialog';
import {
  ProductionPlanDetail,
  ProductSize,
} from '@/types/ProductionPlan';
import { ProductionBatch } from '@/types/ProductionBatch';
import privateCall from '@/api/PrivateCaller';
import ProductImportDetail from './ProductImportDetail';
import { Textarea } from '@/components/ui/textarea';

type Props = {};

const WarehouseInfo = {
  name: 'Warehouse 1',
  address: '123, abc, xyz',
  phone: '1234567890',
  email: 'warehouse@gmail.com',
  fax: '1234567890'
};

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

const NewImportRequest = (props: Props) => {
  const navigate = useNavigate(); // Initialize useNavigate

  const validateQuantityform = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      number: undefined
    }
  });

  const [isEditDetail, setEditDetail] = useState<Boolean>(false);
  const [dialogOpen, setDialogOpen] = useState(false); // State to control AlertDialog open/close
  // const [selectedPO, setSelectedPO] = useState<PurchaseOrder>();
  const [selectedProductionPlanDetails, setSelectedProductionPlanDetails] =
    useState<ProductionPlanDetail>();
  const [selectedProductionBatch, setSelectedProductionBatch] = useState<ProductionBatch>();
  const [description, setDescription] = useState<string>('');
  const { toast } = useToast();
  const handleDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(event.target.value);
  };
  const onSubmit = async () => {
    try {
      if (!selectedProductionBatch ) {
        toast({
          variant: 'destructive',
          title: 'Please choose a Production Batch',
          description: ''
        });
        return;
      }

      const response = await privateCall(
        importRequestApi.createImportProduct({
          productionBatchId: selectedProductionBatch?.id,
          description: description,
          importRequestDetail: {
            productSizeId: selectedProductionBatch?.productionPlanDetail?.productSize.id,
            quantityByPack: selectedProductionBatch?.quantityToProduce
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
        navigate(`/import-request/${responseData.id}`); // Navigate back after successful creation
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: error.message || 'There was a problem with your request.'
      });
    }
  };

  // Re-render ImportRequestDetails when poDeliveryDetails changes

  const handleFormSubmit = () => {
    onSubmit();
    setDialogOpen(false); // Close the dialog after submit
  };

  return (
    <div className="w-full pt-4 flex flex-col gap-4">
      <div className="font-extrabold font-primary flex justify-center text-bluePrimary text-md md:text-3xl">
        NEW PRODUCT IMPORT REQUEST
      </div>
      <div className="w-full px-4">
        <div className="flex flex-col gap-4">
          <div className="font-primary font-bold text-xl mb-4">Product Batch</div>
          <WarehouseImportDialog
            selectedPlanDetails={selectedProductionPlanDetails}
            setSelectedPlanDetails={setSelectedProductionPlanDetails}
            selectedProductionBatch={selectedProductionBatch}
            setSelectedProductionBatch={setSelectedProductionBatch}
          />
        </div>
      </div>

      <div className="flex flex-col gap-4 md:grid grid-cols-2 w-full px-4">
        {/* <div className="flex flex-col gap-4">
          <div className="font-primary font-bold text-xl mb-4">Supplier</div>
          {selectedPO?.supplier ? (
            <div className="flex flex-col gap-4">
              <div className="font-primary font-semibold text-sm">
                Warehouse name: {selectedPO?.supplier.supplierName || 'Unknown'}
              </div>
              <div className="font-primary font-semibold text-sm">
                Address: {selectedPO?.supplier.address || 'Unknown'}
              </div>
              <div className="font-primary font-semibold text-sm">
                Phone: {selectedPO?.supplier.phoneNumber || 'Unknown'}
              </div>
              <div className="font-primary font-semibold text-sm">
                Email: {selectedPO?.supplier.email || 'Unknown'}
              </div>
              <div className="font-primary font-semibold text-sm">
                Fax: {selectedPO?.supplier.fax || 'Unknown'}
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4 text-xl border border-gray-300 rounded-md p-4 h-full">
              <div className="font-bold text-lg text-center">Choose the PO first</div>
            </div>
          )}
        </div> */}
       
        <div className="flex flex-col gap-4">
          <div className="font-primary font-bold text-xl mb-4">Warehouse</div>
          <div className="flex flex-col gap-4">
            <div className="font-primary font-semibold text-sm">
              Warehouse name: {WarehouseInfo.name}
            </div>
            <div className="font-primary font-semibold text-sm">
              Address: {WarehouseInfo.address}
            </div>
            <div className="font-primary font-semibold text-sm">Phone: {WarehouseInfo.phone}</div>
            <div className="font-primary font-semibold text-sm">Email: {WarehouseInfo.email}</div>
            <div className="font-primary font-semibold text-sm">Fax: {WarehouseInfo.fax}</div>
          </div>
        </div>
        <Textarea onChange={handleDescriptionChange} placeholder="Type your message here." />
      </div>

      {/* <ImportRequestDetails
        data={poDeliveryDetails}
        setPoDeliverydetails={setPoDeliverydetails}
        setEditDetail={setEditDetail}
        isEditDetail={isEditDetail}
      /> */}

      {selectedProductionBatch ? (
        <ProductImportDetail
          selectedProductionBatch={selectedProductionBatch}
        />
      ) : (
        <div className="flex justify-center items-center">
          <h1>Choose the production plan first</h1>
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
