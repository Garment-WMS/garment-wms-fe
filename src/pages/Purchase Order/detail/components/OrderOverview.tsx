import { Badge } from '@/components/ui/Badge';
import { PurchaseOrderStatus, PurchaseOrderStatusLabels } from '@/enums/purchaseOrderStatus';
import { convertDate } from '@/helpers/convertDate';
import { cn } from '@/lib/utils';
import { CheckCircle, Package, XCircle } from 'lucide-react';
import React from 'react';

interface KeyValueDisplayProps {
  name: string;
  value: string;
}

interface ImportQuantityCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  variant?: 'success' | 'warning' | 'info';
}

interface OrderOverviewProps {
  poNumber: string;
  subTotalAmount: number | null;
  taxAmount: number | null;
  shippingAmount: number | null;
  otherAmount: number | null;
  orderDate: string;
  expectedFinishDate: string;
  status: PurchaseOrderStatus;
  currency: string;
  totalImportQuantity: number;
  totalFailImportQuantity: number | null;
  totalQuantityToImport: number;
  prodcutionPlanCode: string;
}

const ImportQuantityCard: React.FC<ImportQuantityCardProps> = ({
  title,
  value,
  icon,
  variant = 'info'
}) => {
  const variantStyles = {
    success: 'bg-green-50 border-green-200 text-green-700',
    warning: 'bg-red-50 border-red-200 text-red-700',
    info: 'bg-blue-50 border-blue-200 text-blue-700'
  };

  return (
    <div
      className={cn(
        'rounded-lg p-4 flex items-center space-x-4 border transition-colors duration-200',
        variantStyles[variant]
      )}>
      <div className="flex-shrink-0">{icon}</div>
      <div className="flex-grow">
        <h3 className="text-sm font-medium opacity-80">{title}</h3>
        <p className="text-lg font-semibold">{value}</p>
      </div>
    </div>
  );
};

const KeyValueDisplay: React.FC<KeyValueDisplayProps> = ({ name, value }) => {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="font-medium text-gray-600">{name}:</span>
      <span className="font-semibold text-gray-800">{value}</span>
    </div>
  );
};

const StatusBadge: React.FC<{ status: PurchaseOrderStatus }> = ({ status }) => {
  const colorClass = (() => {
    switch (status) {
      case PurchaseOrderStatus.IN_PROGRESS:
        return 'bg-blue-500 text-white';
      case PurchaseOrderStatus.CANCELLED:
        return 'bg-red-500 text-white';
      case PurchaseOrderStatus.FINISHED:
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  })();

  return (
    <Badge className={`px-4 py-1 rounded-lg text-sm uppercase ${colorClass}`}>
      {PurchaseOrderStatusLabels[status]}
    </Badge>
  );
};

const OrderOverview: React.FC<OrderOverviewProps> = ({
  poNumber,
  subTotalAmount,
  taxAmount,
  shippingAmount,
  otherAmount,
  orderDate,
  expectedFinishDate,
  status,
  currency,
  totalImportQuantity,
  totalFailImportQuantity,
  totalQuantityToImport,
  prodcutionPlanCode
}) => {
  const totalAmount =
    (subTotalAmount || 0) + (taxAmount || 0) + (shippingAmount || 0) + (otherAmount || 0);

  return (
    <div className="bg-white p-8 rounded-lg shadow-md space-y-6">
      {/* Title and Status Badge */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-primaryDark">Purchase Order Overview</h1>
        <StatusBadge status={status} />
      </div>

      {/* Key Details - Order Info */}
      <div className="grid grid-cols-2 gap-8 border-b pb-4 mb-4">
        <div className="space-y-3">
          <KeyValueDisplay name="Purchase Order" value={poNumber} />
          <KeyValueDisplay name="Production Plan" value={prodcutionPlanCode} />
        </div>
        <div className="space-y-3 text-right">
          <KeyValueDisplay name="Purchase Order Date" value={convertDate(orderDate)} />
          <KeyValueDisplay name="Expected Finished Date" value={convertDate(expectedFinishDate)} />
        </div>
      </div>

      {/* Order Amount Breakdown */}
      <div className="space-y-4 border-b pb-4 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Subtotal:</span>
          <span className="text-lg font-semibold text-gray-800">
            {(subTotalAmount || 0).toLocaleString()} {currency}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Tax Amount:</span>
          <span className="text-lg font-semibold text-gray-800">
            {(taxAmount || 0).toLocaleString()} {currency}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Shipping Amount:</span>
          <span className="text-lg font-semibold text-gray-800">
            {(shippingAmount || 0).toLocaleString()} {currency}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Other Amount:</span>
          <span className="text-lg font-semibold text-gray-800">
            {(otherAmount || 0).toLocaleString()} {currency}
          </span>
        </div>
      </div>

      {/* Total Amount */}
      <div className="flex justify-end items-center mt-6">
        <div className="text-right">
          <div className="text-lg text-gray-600 font-medium">Total Amount</div>
          <div className="text-xl font-bold text-blue-700">
            {totalAmount.toLocaleString()} {currency}
          </div>
        </div>
      </div>

      {/* Import Quantities */}
      <div className="mt-8 border-t pt-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Import Quantities</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ImportQuantityCard
            title="Total Imported"
            value={totalImportQuantity.toString()}
            icon={<CheckCircle className="w-6 h-6" />}
            variant="success"
          />
          <ImportQuantityCard
            title="Total Failed"
            value={totalFailImportQuantity !== null ? totalFailImportQuantity.toString() : '0'}
            icon={<XCircle className="w-6 h-6" />}
            variant="warning"
          />
          <ImportQuantityCard
            title="Total to Import"
            value={totalQuantityToImport.toString()}
            icon={<Package className="w-6 h-6" />}
            variant="info"
          />
        </div>
      </div>
    </div>
  );
};

export default OrderOverview;
