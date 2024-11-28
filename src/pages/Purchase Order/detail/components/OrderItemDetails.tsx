import { Badge } from '@/components/ui/Badge';
import ExpandableSectionCustom from './ExpandableSectionCustom';
import { ExternalLink, Eye, Plus } from 'lucide-react';
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
}

const OrderItemDetails: React.FC<OrderItemDetailsProps> = ({
  poDelivery,
  poId,
  poNumber,
  isPendingDelivery
}) => {
  const navigate = useNavigate();
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

  const renderRedirectButton = (delivery: PODelivery, poid: string) => {
    let path = '';
    let color = '';
    let icon;
    let label = '';

    switch (delivery.status) {
      case PurchaseOrderDeliveryStatus.PENDING:
        color = 'bg-blue-400';
        icon = <Plus size={16} />;
        label = 'Create Import Request';
        //TODO: Need to change path later, also need to pass the parameter
        path = `/import-request/create/material/${delivery.id}`;
        break;
      case PurchaseOrderDeliveryStatus.FINISHED:
        color = 'bg-green-400';
        icon = <Eye size={16} />;
        label = 'View Details';
        path = `/purchase-order/${poid}/po-delivery/${delivery.id}`;
        break;
      default:
        color = 'bg-green-400';
        icon = <Eye size={16} />;
        label = 'View Details';
        path = `/purchase-order/${poid}/po-delivery/${delivery.id}`;
        break;
    }

    return (
      <TooltipProvider>
        <Tooltip delayDuration={5}>
          <TooltipTrigger asChild>
            <Button
              className={`w-30  ${color}`}
              size={'sm'}
              onClick={() => {
                if (poId) {
                  navigate(path, { state: { delivery, poNumber } });
                }
              }}>
              {icon}
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
  return (
    <div className="mt-8">
      <h1 className="text-2xl font-bold text-primaryDark">Purchase Delivery</h1>
      <div className="mt-5 flex flex-col gap-6">
        {isPendingDelivery
          ? // Render skeletons if data is pending
            Array(3)
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
          : // Render actual data if available
            poDelivery.map((delivery) => {
              const totalMaterialAmount = delivery.poDeliveryDetail.reduce(
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
                  redirectButton={renderRedirectButton(delivery, poId || '')}
                  isExtra={delivery.isExtra}
                  defaultOpen={false}>
                  <div className="flex items-center justify-between mt-5 gap-6">
                    <div className="flex justify-end items-center space-x-4">
                      <div className="text-right flex items-center gap-3">
                        <div className="text-slate-600">Total Amount:</div>
                        <div className="text-lg font-bold text-blue-600">
                          {totalMaterialAmount.toLocaleString()} VND
                        </div>
                      </div>
                    </div>
                    <Link
                      to={`/purchase-order/${poId}/po-delivery/${delivery.id}`}
                      state={{ delivery, poNumber }}
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
