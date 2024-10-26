import { Badge } from '@/components/ui/Badge';
import { Truck } from 'lucide-react';
import { useLocation, useParams } from 'react-router-dom';
import { convertDate } from '@/helpers/convertDate';
import MaterialList from './components/MaterialList';
import { PODelivery, PODeliveryDetail } from '@/types/purchaseOrder';
import { PurchaseOrderDeliveryStatus } from '@/enums/purchaseOrderDeliveryStatus';
import { BreadcrumbResponsive } from '@/components/common/BreadcrumbReponsive';

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

  const breadcrumbItems = [
    { label: 'Purchase Orders', href: '/purchase-staff/purchase-order' },
    { label: `Purchase Order #${poNumber}`, href: `/purchase-staff/purchase-order/${poId}` },
    {
      label: `Delivery #${delivery.code}`,
      href: `/purchase-staff/purchase-order/${poId}/po-delivery/${delivery.id}`,
      disabled: true
    }
  ];

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
    <main className="w-full h-screen bg-white rounded-xl shadow-xl  px-8 pt-6 pb-8 pl-5">
      <BreadcrumbResponsive breadcrumbItems={breadcrumbItems} itemsToDisplay={3} />
      {/* Header */}
      <section className="flex items-center justify-between border-b border-gray-200 pb-5 mb-6 mt-5">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-medium text-gray-700">Purchase Order Delivery ID:</h1>
            <h1 className="text-2xl font-bold text-primaryDark">{delivery.id}</h1>
          </div>

          <div className="flex items-center gap-2 text-green-600">
            <Truck className="text-sm" />
            <span className="text-sm">Estimated Delivery:</span>
            <span className="ml-3 font-semibold">
              {delivery.expectedDeliverDate ? convertDate(delivery.expectedDeliverDate) : 'N/A'}
            </span>
          </div>
        </div>

        <Badge className={`px-3 py-2 rounded-md text-lg ${getStatusBadgeClass(delivery.status)}`}>
          {delivery.status}
        </Badge>
      </section>

      {/* Material List */}
      <section className="flex flex-col gap-6 border-b border-gray-200 pb-6 mb-6">
        <h2 className="text-xl font-semibold text-primaryDark">Materials</h2>
        {delivery.poDeliveryDetail.map((detail: PODeliveryDetail) => (
          <MaterialList key={detail.id} detail={detail} />
        ))}
      </section>

      {/* Purchaser Info */}
      <section className="flex items-center justify-between border-b border-gray-200 pb-6 mb-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-lg font-semibold text-gray-700">Purchasing Staff</h1>
          <div className="flex items-center gap-2">
            <span className="text-slate-500">Staff ID:</span>
            <span className="font-semibold text-gray-700">3890428394823</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-500">Staff Name:</span>
            <span className="font-semibold text-gray-700">Huy Long</span>
          </div>
        </div>
        <div className="flex flex-col gap-2 w-72">
          <h1 className="text-lg font-semibold text-gray-700">Delivery Address</h1>
          <p className="text-gray-600 leading-relaxed">
            Lo E2a-7, Duong D1, D. D1, Long Thanh My, Thanh Pho Thu Duc
          </p>
        </div>
      </section>

      {/* Order Summary */}
      <section className="border-t border-gray-200 pt-6 mt-8">
        <h2 className="text-xl font-semibold text-primaryDark mb-4">Order Summary</h2>

        <div className="flex justify-between items-center text-lg">
          {/* Flexbox for aligning Total Quantity and Total Amount on the same line */}
          <div className="flex items-center gap-2">
            <span className="text-gray-500 block">Total Quantity: </span>
            <span className="text-gray-700 font-medium">{totalQuantity} items</span>
          </div>

          <div className="text-right">
            <span className="text-gray-500 block">Total Amount</span>
            <span className="text-4xl font-bold text-blue-600">
              {totalMaterialAmount.toLocaleString()} VND
            </span>
          </div>
        </div>
      </section>
    </main>
  );
};

export default PurchaseOrderDeliveryDetails;
