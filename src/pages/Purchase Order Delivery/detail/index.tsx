import { Badge } from '@/components/ui/Badge';
import { Clock, Package, Truck } from 'lucide-react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { convertDate } from '@/helpers/convertDate';
import MaterialList from './components/MaterialList';
import { PODelivery, PODeliveryDetail } from '@/types/PurchaseOrder';
import { PurchaseOrderDeliveryStatus } from '@/enums/purchaseOrderDeliveryStatus';
import { BreadcrumbResponsive } from '@/components/common/BreadcrumbReponsive';
import { Button } from '@/components/ui/button';

const PurchaseOrderDeliveryDetails = () => {
  const location = useLocation();
  const { delivery, poNumber } = location.state as { delivery: PODelivery; poNumber: string };
  const { poId } = useParams();
  const totalMaterialAmount = delivery.poDeliveryDetail.reduce(
    (sum: number, detail: PODeliveryDetail) => sum + (detail.totalAmount || 0),
    0
  );
  const totalQuantity = delivery.poDeliveryDetail.reduce(
    (sum: number, detail: PODeliveryDetail) => sum + (detail.quantityByPack || 0),
    0
  );

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
    <main className="w-full h-screen bg-white rounded-xl shadow-xl px-8 pt-6 pb-8 pl-5">
      {/* Header */}
      <section className="flex items-center justify-between border-b border-gray-200 pb-5 mb-6 mt-5">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-medium text-gray-700">Purchase Order Delivery ID:</h1>
            <h1 className="text-2xl font-bold text-primaryDark">{delivery?.code}</h1>
            <div className="mt-1 ml-2">
              <Badge
                className={`px-3 py-1 rounded-md text-lg mb-2 ${getStatusBadgeClass(delivery.status)}`}>
                {delivery.status}
              </Badge>
            </div>
          </div>

          <div className="flex flex-row items-center space-x-9">
            {/* Estimated Delivery */}
            <div className="flex items-center gap-2 text-blue-600">
              <Clock className="text-sm" />
              <span className="text-sm">Estimated Delivery:</span>
              <span className="ml-3 font-semibold">
                {delivery.expectedDeliverDate ? convertDate(delivery.expectedDeliverDate) : 'N/A'}
              </span>
            </div>

            {/* Actual Delivery */}
            <div className="flex items-center gap-2 text-green-600">
              <Package className="text-sm" />
              <span className="text-sm">Actual Delivery:</span>
              <span className="ml-3 font-semibold">
                {delivery.deliverDate ? convertDate(delivery.deliverDate) : '-'}
              </span>
            </div>
          </div>
        </div>

        <div className="items-center flex flex-col justify-center">
          {delivery && delivery?.importRequest && delivery?.importRequest[0]?.id ? (
            <Link to={`/import-request/${delivery.importRequest[0].id}`}>
              <Button
                className={`px-3 py-2 rounded-md text-lg bg-white ${getStatusBadgeClass(delivery.status)}`}>
                View Import Request
              </Button>{' '}
            </Link>
          ) : null}
        </div>
      </section>

      {/* Material List */}
      <section className="flex flex-col gap-6 border-b border-gray-200 pb-6 mb-6">
        <h2 className="text-xl font-semibold text-primaryDark">Materials</h2>
        {delivery.poDeliveryDetail.map((detail: PODeliveryDetail) => (
          <MaterialList key={detail.id} detail={detail} status={delivery?.status} />
        ))}
      </section>

      {/* Order Summary */}
      <section className="border-t border-gray-200 pt-6 -mt-9 hidden">
        <h2 className="text-xl font-semibold text-primaryDark mb-4">Order Summary</h2>

        <div className="flex flex-wrap justify-between items-center text-lg">
          <div className="flex items-center gap-2 flex-1">
            <span className="text-gray-500 block">Total Quantity: </span>
            <span className="text-gray-700 font-medium">{totalQuantity} items</span>
          </div>

          <div className="text-right flex-1">
            <span className="text-gray-500 block">Total Amount</span>
            <span className="text-4xl font-bold text-blue-600 break-words">
              {totalMaterialAmount.toLocaleString()} VND
            </span>
          </div>
        </div>
      </section>
    </main>
  );
};

export default PurchaseOrderDeliveryDetails;
