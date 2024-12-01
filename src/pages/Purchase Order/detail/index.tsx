import OrderItemDetails from './components/OrderItemDetails';
import OrderOverview from './components/OrderOverview';
import OrderToDetails from './components/OrderToDetails';
import { useParams } from 'react-router-dom';
import { useGetPurchaseOrderById } from '@/hooks/useGetPurchaseOrderById';
import Loading from '@/components/common/Loading';
import { PurchaseOrderStatus } from '@/enums/purchaseOrderStatus';
import { useGetPurchaseOrderDeliveryByPoId } from '@/hooks/useGetPurchaseOrderDeliveryByPoID';

const statusMap: Record<string, PurchaseOrderStatus> = {
  IN_PROGRESS: PurchaseOrderStatus.IN_PROGRESS,
  CANCELLED: PurchaseOrderStatus.CANCELLED,
  FINISHED: PurchaseOrderStatus.FINISHED
};

const PurchaseOrderDetails: React.FC = () => {
  const { id } = useParams();
  const { data, isPending, isError } = useGetPurchaseOrderById(id!);
  const { data: poDeliveryData, isPending: isPedingDelivery } = useGetPurchaseOrderDeliveryByPoId(
    id ?? ''
  );
  if (isPending) {
    return (
      <div className="flex justify-center items-center">
        <Loading />
      </div>
    );
  }
  if (isError) {
    return <div>Failed to load purchase order details</div>;
  }
  const purchaseOrder = data?.data;
  if (!purchaseOrder) {
    return <div>No data found</div>;
  }

  const {
    poNumber,
    subTotalAmount,
    orderDate,
    expectedFinishDate,
    supplier,
    currency,
    status: poStatus,
    taxAmount,
    shippingAmount,
    otherAmount,
    totalImportQuantity,
    totalFailImportQuantity,
    totalQuantityToImport,
    totalPoDelivery,
    totalFinishedPoDelivery,
    totalInProgressPoDelivery,
    totalPendingPoDelivery,
    totalCancelledPoDelivery,
    productionPlan,
    finishDate
  } = purchaseOrder;

  return (
    <section className="h-full w-full px-4  py-3 flex flex-col space-y-7">
      <div className="bg-white px-5 py-3 rounded-xl shadow-lg ring-1 ring-gray-300 flex flex-col gap-8">
        {/* Order overview */}
        <OrderOverview
          poNumber={poNumber}
          subTotalAmount={subTotalAmount}
          orderDate={orderDate}
          expectedFinishDate={expectedFinishDate}
          status={statusMap[poStatus]}
          currency={currency}
          taxAmount={taxAmount}
          shippingAmount={shippingAmount}
          otherAmount={otherAmount}
          totalImportQuantity={totalImportQuantity}
          totalFailImportQuantity={totalFailImportQuantity}
          totalQuantityToImport={totalQuantityToImport}
          productionPlanCode={productionPlan?.code}
          finishDate={finishDate}
        />
        {/* Order to details */}
        <div className="hidden">
          <OrderToDetails supplier={supplier} />
        </div>
        {/* Order item details */}
        <OrderItemDetails
          poDelivery={poDeliveryData?.data}
          poId={id}
          poNumber={poNumber}
          isPendingDelivery={isPedingDelivery}
          totalDelivery={totalPoDelivery}
          totalFinishDelivery={totalFinishedPoDelivery}
          totalInProgressDelivery={totalInProgressPoDelivery}
          totalPendingDelivery={totalPendingPoDelivery}
          totalCancelDelivery={totalCancelledPoDelivery}
        />
      </div>
    </section>
  );
};

export default PurchaseOrderDetails;
