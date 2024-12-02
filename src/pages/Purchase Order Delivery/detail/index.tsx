import { Badge } from '@/components/ui/Badge';
import { Clock, Package } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { convertDate } from '@/helpers/convertDate';
import MaterialList from './components/MaterialList';
import { PODelivery, PODeliveryDetail } from '@/types/PurchaseOrder';
import { PurchaseOrderDeliveryStatus } from '@/enums/purchaseOrderDeliveryStatus';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar } from '@radix-ui/react-avatar';
import { AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import avaImg from '@/assets/images/avatar.png';
import { convertToVietnamesePhoneNumber } from '../../../helpers/convertPhoneNumber';

const PurchaseOrderDeliveryDetails = () => {
  const location = useLocation();
  const { delivery, poNumber, purchasingStaff } = location.state as {
    delivery: PODelivery;
    poNumber: string;
    purchasingStaff: any;
  };
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
    <main className="grid grid-cols-[2fr_1fr] gap-6">
      <div className="w-full bg-white rounded-xl shadow-lg p-6">
        {/* Header */}
        <section className="flex flex-col gap-4 border-b border-gray-200 pb-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-lg font-medium text-gray-700">Purchase Order Delivery</h1>
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-primaryDark">{delivery?.code}</h1>
              <Badge
                className={`px-3 py-1 rounded-md text-md ${getStatusBadgeClass(delivery.status)}`}>
                {delivery.status}
              </Badge>
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center text-blue-600 gap-2">
              <Clock />
              <span className="text-sm">Estimated Delivery:</span>
              <span className="font-medium">
                {convertDate(delivery.expectedDeliverDate) || 'N/A'}
              </span>
            </div>
            <div className="flex items-center text-green-600 gap-2">
              <Package />
              <span className="text-sm">Actual Delivery:</span>
              <span className="font-medium">
                {delivery.deliverDate ? convertDate(delivery.deliverDate) : '-'}
              </span>
            </div>
          </div>
        </section>

        {/* Material List */}
        <section className="mt-6">
          <h2 className="text-xl font-semibold text-primaryDark mb-4">Materials</h2>
          {delivery.poDeliveryDetail.map((detail: PODeliveryDetail) => (
            <MaterialList key={detail.id} detail={detail} status={delivery?.status} />
          ))}
        </section>
      </div>

      {/* Purchasing Staff Card */}
      <Card className="sticky top-4 bg-white shadow-md rounded-lg">
        <CardHeader className="bg-blue-200 p-4 rounded-t-lg">
          <CardTitle className="text-center text-lg font-bold text-gray-800">
            Purchasing Staff
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16 rounded-full shadow">
              <AvatarImage
                src={purchasingStaff?.account?.avatarUrl || avaImg}
                alt={`${purchasingStaff?.account?.firstName || ''} ${purchasingStaff?.account?.lastName || ''}`}
              />
              <AvatarFallback>
                {purchasingStaff?.account?.firstName?.[0] || 'P'}
                {purchasingStaff?.account?.lastName?.[0] || 'S'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-xl text-gray-900">
                {`${purchasingStaff?.account?.firstName || ''} ${purchasingStaff?.account?.lastName || ''}`}
              </h3>
              <p className="text-sm text-gray-600">{purchasingStaff?.account?.email || 'N/A'}</p>
            </div>
          </div>
          <div className="mt-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-500">Account Username:</span>
              <span className="text-gray-800 font-medium">
                {purchasingStaff?.account?.username || 'N/A'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-500">Phone:</span>
              <span className="text-gray-800 font-medium">
                {convertToVietnamesePhoneNumber(purchasingStaff?.account?.phoneNumber || 'N/A')}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-500">Gender:</span>
              <span className="text-gray-800 font-medium">
                {purchasingStaff?.account?.gender === 'MALE' ? 'Male' : 'Female'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-500">Date of Birth:</span>
              <span className="text-gray-800 font-medium">
                {convertDate(purchasingStaff?.account?.dateOfBirth) || 'N/A'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
};

export default PurchaseOrderDeliveryDetails;
