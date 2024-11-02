import { Badge } from '@/components/ui/Badge';
import ExpandableSectionCustom from './ExpandableSectionCustom';
import { ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { convertDate } from '@/helpers/convertDate';
import MaterialTable from './MaterialTable';
import { PODelivery, PODeliveryDetail } from '@/types/purchaseOrder';
import {
  PurchaseOrderDeliveryStatusLabels,
  PurchaseOrderDeliveryStatus
} from '@/enums/purchaseOrderDeliveryStatus';

interface OrderItemDetailsProps {
  poDelivery: PODelivery[];
  poId: string | undefined;
  poNumber?: string;
}

const OrderItemDetails: React.FC<OrderItemDetailsProps> = ({ poDelivery, poId, poNumber }) => {
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

  return (
    <div className="mt-8">
      <h1 className="text-2xl font-bold text-primaryDark">Purchase Delivery </h1>
      <div className="mt-5 flex flex-col gap-6">
        {poDelivery.map((delivery) => {
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
              defaultOpen={false}>
              <div className="flex items-center justify-between mt-5 gap-6">
                <div className="flex justify-end items-center space-x-4">
                  <div className="text-right flex items-center gap-3">
                    <div className=" text-slate-600">Total Amount:</div>
                    <div className="text-lg font-bold text-blue-600">
                      {totalMaterialAmount.toLocaleString()} VND
                    </div>
                  </div>
                </div>

                <Link
                  to={`/purchase-staff/purchase-order/${poId}/po-delivery/${delivery.id}`}
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
