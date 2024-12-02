import { Badge } from '@/components/ui/Badge';
import { PurchaseOrderStatus, PurchaseOrderStatusLabels } from '@/enums/purchaseOrderStatus';
import { convertDate } from '@/helpers/convertDate';
import { convertDateWithTime } from '@/helpers/convertDateWithTime';
import { XCircle } from 'lucide-react';
import React from 'react';

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
      className={`px-4 py-1.5 rounded-full text-sm font-medium ${variants[status] || 'bg-gray-500 text-white'}`}>
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
  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex flex-col items-start">
          <div className="flex flex-row items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">Purchase Order Overview</h1>
            <XCircle className="w-9 h-9 text-red-600" />
          </div>
          {status === PurchaseOrderStatus.CANCELLED && (
            <KeyValueDisplay
              name="Cancelled At"
              value={cancelledAt ? convertDateWithTime(cancelledAt) : '-'}
              valueColor={'text-red-800'}
              nameColor="text-red-600"
            />
          )}
        </div>

        <StatusBadge status={status} />
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
          <KeyValueDisplay
            name="Finished Date"
            value={finishDate ? convertDate(finishDate) : '-'}
            valueColor={finishDate ? 'text-green-600' : 'text-gray-900'}
          />
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
    </div>
  );
};

export default OrderOverview;
