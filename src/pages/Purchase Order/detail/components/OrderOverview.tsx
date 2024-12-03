import { PurchasingStaffGuardDiv } from '@/components/authentication/createRoleGuard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/button';
import { PurchaseOrderStatus, PurchaseOrderStatusLabels } from '@/enums/purchaseOrderStatus';
import { convertDate } from '@/helpers/convertDate';
import { convertDateWithTime } from '@/helpers/convertDateWithTime';
import { XCircle } from 'lucide-react';
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { cancelPurchaseOrder } from '@/api/services/purchaseOrder';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';

interface KeyValueDisplayProps {
  name: string;
  value: string | number;
  className?: string;
  valueColor?: string;
  nameColor?: string;
}

interface OrderOverviewProps {
  poNumber: string;
  subTotalAmount: number | null;
  taxAmount: number | null;
  shippingAmount: number | null;
  otherAmount: number | null;
  orderDate: string;
  finishDate: string;
  expectedFinishDate: string;
  status: PurchaseOrderStatus;
  currency: string;
  totalImportQuantity: number;
  totalFailImportQuantity: number | null;
  totalQuantityToImport: number;
  productionPlanCode: string;
  cancelledAt?: string;
}

const KeyValueDisplay: React.FC<KeyValueDisplayProps> = ({
  name,
  value,
  className = '',
  nameColor = 'text-gray-600',
  valueColor = 'text-gray-900'
}) => {
  return (
    <div
      className={`flex items-center gap-4 py-3 border-b border-gray-100 last:border-0 ${className}`}>
      <span className={`text-[15px] ${nameColor} flex-1`}>{name}</span>
      <span className={`text-[18px] font-medium ${valueColor}`}>{value}</span>
    </div>
  );
};

const StatusBadge: React.FC<{ status: PurchaseOrderStatus }> = ({ status }) => {
  const variants = {
    [PurchaseOrderStatus.IN_PROGRESS]: 'bg-blue-500 text-white',
    [PurchaseOrderStatus.CANCELLED]: 'bg-red-500 text-white',
    [PurchaseOrderStatus.FINISHED]: 'bg-green-500 text-white'
  };

  return (
    <Badge
      className={`px-4 py-1.5 rounded-full text-sm font-medium ${
        variants[status] || 'bg-gray-500 text-white'
      }`}>
      {PurchaseOrderStatusLabels[status]}
    </Badge>
  );
};

const OrderOverview: React.FC<OrderOverviewProps> = ({
  poNumber,
  orderDate,
  expectedFinishDate,
  status,
  totalImportQuantity,
  totalFailImportQuantity,
  totalQuantityToImport,
  productionPlanCode,
  finishDate,
  cancelledAt
}) => {
  const { id } = useParams(); // Get purchase order ID from the route params
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  const handleConfirmCancel = async () => {
    if (id) {
      const validCancelReason =
        cancelReason && cancelReason.trim() ? cancelReason.trim() : 'No reason provided';
      try {
        const response = await cancelPurchaseOrder(id, validCancelReason);
        if (response?.statusCode === 200) {
          toast({
            variant: 'success',
            title: 'Purchase Order Cancelled',
            description: `Purchase Order ${poNumber} has been successfully cancelled.`
          });
          navigate(0);
        } else {
          handleBackendErrors(response);
        }
      } catch (error: any) {
        if (axios.isAxiosError(error) && error.response) {
          handleBackendErrors(error.response.data);
        } else {
          toast({
            variant: 'destructive',
            title: 'Error',
            description: `An unexpected error occurred while cancelling Purchase Order ${poNumber}.`
          });
        }
      } finally {
        setIsModalOpen(false);
        setCancelReason('');
      }
    }
  };

  const handleBackendErrors = (response: any) => {
    if (response?.errors?.length > 0) {
      const backendError = response.errors[0];
      if (backendError.property === 'cancelledReason' && backendError.constraints) {
        toast({
          variant: 'destructive',
          title: 'Invalid Cancellation Reason',
          description: backendError.constraints.isString || response.message || 'Invalid input.'
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Cancellation Failed',
          description: response.message || 'An unexpected error occurred.'
        });
      }
    } else {
      toast({
        variant: 'destructive',
        title: 'Cancellation Failed',
        description: response.message || 'An unexpected error occurred.'
      });
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex flex-col items-start">
          <div className="flex flex-row items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">Purchase Order Overview</h1>
            {status === PurchaseOrderStatus.CANCELLED && (
              <XCircle className="w-9 h-9 text-red-600" />
            )}
          </div>
        </div>

        <div className="flex flex-row items-center gap-3">
          <StatusBadge status={status} />
          <PurchasingStaffGuardDiv>
            {status === PurchaseOrderStatus.IN_PROGRESS && (
              <Button variant="destructive" onClick={() => setIsModalOpen(true)}>
                Cancel Order
              </Button>
            )}
          </PurchasingStaffGuardDiv>
        </div>
      </div>

      {/* Order Details Section */}
      <div className="grid grid-cols-2 gap-x-12 gap-y-2 mb-12">
        <div className="space-y-1">
          <KeyValueDisplay name="Purchase Order" value={poNumber} valueColor="text-primaryLight" />
          <KeyValueDisplay
            name="Production Plan"
            value={productionPlanCode}
            valueColor="text-primaryLight"
          />
        </div>
        <div className="space-y-1">
          <KeyValueDisplay name="Purchase Order Date" value={convertDate(orderDate)} />
          <KeyValueDisplay name="Expected Finished Date" value={convertDate(expectedFinishDate)} />
          {status !== PurchaseOrderStatus.CANCELLED && (
            <KeyValueDisplay
              name="Finished Date"
              value={finishDate ? convertDateWithTime(finishDate) : '-'}
              valueColor={finishDate ? 'text-green-600' : 'text-gray-900'}
            />
          )}
          {status === PurchaseOrderStatus.CANCELLED && (
            <KeyValueDisplay
              name="Cancelled At"
              value={cancelledAt ? convertDateWithTime(cancelledAt) : '-'}
              valueColor={'text-red-800'}
              nameColor="text-red-600"
            />
          )}
        </div>
      </div>

      {/* Import Summary Section */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Import Summary</h2>
        <div className="space-y-1">
          <KeyValueDisplay
            name="Total Imported Items"
            value={`${totalImportQuantity.toLocaleString()} items`}
            valueColor="text-green-600"
          />
          <KeyValueDisplay
            name="Failed Imports"
            value={`${(totalFailImportQuantity || 0).toLocaleString()} items`}
            valueColor="text-red-600"
          />
          <KeyValueDisplay
            name="Items Remaining to Import"
            value={`${totalQuantityToImport.toLocaleString()} items`}
          />
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-red-500">Cancel Purchase Order</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel Purchase Order{' '}
              <span className="font-semibold text-primaryLight">{poNumber}</span>? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              id="cancelReason"
              placeholder="Enter reason for cancellation"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmCancel} disabled={!cancelReason.trim()}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrderOverview;
