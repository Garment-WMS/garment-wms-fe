import React from 'react';
import { Badge } from '@/components/ui/Badge';
import ExpandableSectionCustom from './ExpandableSectionCustom';
import { ExternalLink, CheckCircle, RefreshCcw, Clock, XCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { convertDate } from '@/helpers/convertDate';
import MaterialTable from './MaterialTable';
import { PODelivery, PODeliveryDetail } from '@/types/PurchaseOrder';
import {
  PurchaseOrderDeliveryStatusLabels,
  PurchaseOrderDeliveryStatus
} from '@/enums/purchaseOrderDeliveryStatus';
import ExpandableSectionSkeleton from '@/components/common/ExpandableSkeleton';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { TooltipArrow } from '@radix-ui/react-tooltip';

interface OrderItemDetailsProps {
  poDelivery: PODelivery[];
  poId: string | undefined;
  poNumber?: string;
  isPendingDelivery?: boolean;
  totalDelivery?: number;
  totalFinishDelivery?: number;
  totalInProgressDelivery?: number;
  totalPendingDelivery?: number;
  totalCancelDelivery?: number;
  purchasingStaff?: any;
  cancelledAt?: string;
}

interface ImportQuantityCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  variant?: 'finish' | 'in-progress' | 'pending' | 'cancel';
}

const ImportQuantityCard: React.FC<ImportQuantityCardProps> = ({
  title,
  value,
  icon,
  variant = 'pending'
}) => {
  const variantStyles = {
    finish: 'bg-green-50 border-green-200 text-green-700',
    cancel: 'bg-red-50 border-red-200 text-red-700',
    'in-progress': 'bg-blue-50 border-blue-200 text-blue-700',
    pending: 'bg-yellow-50 border-yellow-200 text-yellow-700'
  };

  const selectedStyles = variantStyles[variant] || 'bg-gray-50 border-gray-200 text-gray-700';

  return (
    <div className={`p-4 border rounded-lg flex flex-col items-center ${selectedStyles}`}>
      <div className="text-xl">{icon}</div>
      <div className="mt-2 text-lg font-semibold text-center">{title}</div>
      <div className="mt-1 text-xl font-bold">{value}</div>
    </div>
  );
};

const OrderItemDetails: React.FC<OrderItemDetailsProps> = ({
  poDelivery,
  poId,
  poNumber,
  isPendingDelivery,
  totalDelivery = 0,
  totalFinishDelivery = 0,
  totalInProgressDelivery = 0,
  totalPendingDelivery = 0,
  totalCancelDelivery = 0,
  purchasingStaff = {},
  cancelledAt = ''
}) => {
  const navigate = useNavigate();
  console.log(poDelivery);
  const getStatusBadgeClass = (status: PurchaseOrderDeliveryStatus) => {
    switch (status) {
      case PurchaseOrderDeliveryStatus.PENDING:
        return 'bg-yellow-500 text-white';
      case PurchaseOrderDeliveryStatus.FINISHED:
        return 'bg-green-500 text-white';
      case PurchaseOrderDeliveryStatus.CANCELLED:
        return 'bg-red-500 text-white';
      case PurchaseOrderDeliveryStatus.IMPORTING:
        return 'bg-blue-500 text-white';
      default:
        return 'bg-gray-300 text-white';
    }
  };

  const renderRedirectButton = (delivery: PODelivery, poid: string, hasOtherPending: boolean) => {
    if (delivery.isExtra && hasOtherPending) {
      return null;
    }

    let path = '';
    let color = '';
    let label = '';

    switch (delivery.status) {
      case PurchaseOrderDeliveryStatus.PENDING:
        color = 'bg-primaryLight';
        label = 'Create Import Request';
        path = `/import-request/create/material/${delivery.id}`;
        break;
      default:
        return null;
    }

    return (
      <TooltipProvider>
        <Tooltip delayDuration={5}>
          <TooltipTrigger asChild>
            <Button
              className={`w-30 ${color}`}
              size={'sm'}
              onClick={() => {
                if (poId) {
                  navigate(path, { state: { delivery, poNumber } });
                }
              }}>
              {label}
            </Button>
          </TooltipTrigger>
          <TooltipContent className="mb-1" side="top">
            <TooltipArrow />
            <p>{label}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  const hasOtherPending =
    poDelivery &&
    poDelivery?.some(
      (delivery) => delivery.status === PurchaseOrderDeliveryStatus.PENDING && !delivery.isExtra
    );

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primaryDark">Purchase Delivery</h1>
        <div className="flex items-center space-x-2 bg-primaryLight text-white px-4 py-2 rounded-full shadow-md">
          <span className="text-sm font-medium">Total:</span>
          <span className="text-xl font-semibold">{totalDelivery}</span>
        </div>
      </div>

      {/* ImportQuantityCard Components */}
      <div className="mt-4 grid grid-cols-4 gap-4">
        <ImportQuantityCard
          title="Pending"
          value={totalPendingDelivery.toString()}
          icon={<Clock className="text-yellow-700" size={24} />}
          variant="pending"
        />
        <ImportQuantityCard
          title="In Progress"
          value={totalInProgressDelivery.toString()}
          icon={<RefreshCcw className="text-blue-700" size={24} />}
          variant="in-progress"
        />
        <ImportQuantityCard
          title="Finished"
          value={totalFinishDelivery.toString()}
          icon={<CheckCircle className="text-green-700" size={24} />}
          variant="finish"
        />
        <ImportQuantityCard
          title="Cancelled"
          value={totalCancelDelivery.toString()}
          icon={<XCircle className="text-red-700" size={24} />}
          variant="cancel"
        />
      </div>

      <div className="mt-5 flex flex-col gap-6">
        {isPendingDelivery
          ? Array(3)
              .fill(null)
              .map((_, index) => (
                <ExpandableSectionSkeleton
                  key={index}
                  title="Loading..."
                  status={
                    <Badge className="bg-gray-300 text-white px-3 py-2 rounded-md">Loading</Badge>
                  }
                />
              ))
          : poDelivery.map((delivery) => {
              const totalMaterialAmount = delivery?.poDeliveryDetail?.reduce(
                (sum: number, detail: PODeliveryDetail) => sum + (detail.totalAmount || 0),
                0
              );
              return (
                <ExpandableSectionCustom
                  key={delivery.id}
                  title={convertDate(delivery.expectedDeliverDate)}
                  status={
                    <Badge className={`${getStatusBadgeClass(delivery.status)} text-center`}>
                      {
                        PurchaseOrderDeliveryStatusLabels[
                          delivery.status as PurchaseOrderDeliveryStatus
                        ]
                      }
                    </Badge>
                  }
                  redirectButton={renderRedirectButton(delivery, poId || '', hasOtherPending)}
                  isExtra={delivery.isExtra}
                  defaultOpen={false}>
                  <div className="flex items-center justify-between mt-5 gap-6">
                    <div className="flex justify-end items-center space-x-4">
                      <div className="text-right flex items-center gap-3">
                        <div className="text-slate-600">Total Amount:</div>
                        <div className="text-lg font-bold text-blue-600">
                          {totalMaterialAmount?.toLocaleString()} VND
                        </div>
                      </div>
                    </div>
                    <Link
                      to={`/purchase-order/${poId}/po-delivery/${delivery.id}`}
                      state={{ delivery, poNumber, purchasingStaff, cancelledAt }}
                      className="flex items-center gap-2 text-primaryDark hover:opacity-80">
                      <h1 className="text-base font-semibold">View details</h1>
                      <ExternalLink size={18} />
                    </Link>
                  </div>
                  <div className="mt-4 border-t pt-4">
                    <MaterialTable poDeliveryDetail={delivery.poDeliveryDetail} />
                  </div>
                </ExpandableSectionCustom>
              );
            })}
      </div>
    </div>
  );
};

export default OrderItemDetails;
