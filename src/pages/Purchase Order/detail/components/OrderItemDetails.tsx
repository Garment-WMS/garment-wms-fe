import { Badge } from '@/components/ui/Badge';
import ExpandableSectionCustom from './ExpandableSectionCustom';
import { ExternalLink } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { convertDate } from '@/helpers/convertDate';
import MaterialTable from './MaterialTable';
import { PODelivery } from '@/types/PurchaseOrder';

interface OrderItemDetailsProps {
  poDelivery: PODelivery[];
}

const OrderItemDetails: React.FC<OrderItemDetailsProps> = ({ poDelivery }) => {
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-500 text-white';
      case 'FINISHED':
        return 'bg-green-500 text-white';
      case 'CANCELLED':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-300 text-white';
    }
  };

  return (
    <div className="mt-8">
      <h1 className="text-2xl font-bold text-primaryDark">Purchase Delivery</h1>
      <div className="mt-5 flex flex-col gap-6">
        {poDelivery.map((delivery) => {
          const totalMaterialAmount = delivery.poDeliveryDetail.reduce((sum, detail) => {
            return sum + (detail.totalAmount || 0); // ensure totalAmount is a number
          }, 0);
          return (
            <ExpandableSectionCustom
              key={delivery.id}
              title={convertDate(delivery.expectedDeliverDate)}
              status={
                <Badge className={`${getStatusBadgeClass(delivery.status)} text-center`}>
                  {delivery.status}
                </Badge>
              }
              defaultOpen={false}>
              <div className="flex items-center justify-between mt-5 gap-6">
                {/* Total amount for each delivery */}
                <div className="flex justify-end items-center space-x-4">
                  <div className="text-right flex items-center gap-3">
                    <div className=" text-slate-600">Total Amount:</div>
                    <div className="text-lg font-bold text-blue-600">
                      {totalMaterialAmount.toLocaleString()} VND
                    </div>
                  </div>
                </div>

                <Link
                  to={`/purchase-staff/purchase-order/delivery/${delivery.id}`}
                  state={{ delivery }}
                  className="flex items-center gap-2 text-primaryDark hover:opacity-80">
                  <h1 className="text-base font-semibold">View details</h1>
                  <ExternalLink size={18} />
                </Link>
              </div>

              {/* Render table for material details */}
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
