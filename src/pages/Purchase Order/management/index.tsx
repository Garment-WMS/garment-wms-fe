import Introduction from './components/Introduction';
import ProgressList from './components/ProgressList';
import PurchaseOrderList from './components/PurchaseOrderList';
import { useState } from 'react';
import { PurchaseOrder } from '@/types/PurchaseOrder';
import { useGetAllPurchaseOrder } from '@/hooks/useGetAllPurchaseOrder';

const PurchaseOrderManagement = () => {
  const [poList, setPoList] = useState<PurchaseOrder[]>([]);
  const { data, isPending, isError, isSuccess } = useGetAllPurchaseOrder();
  if (isPending) {
    return <p>Loading...</p>;
  }
  if (isError) {
    return <p>Failed to fetch purchase orders</p>;
  }
  if (isSuccess && data?.data?.data && poList.length === 0) {
    setPoList(data.data.data);
  }

  return (
    <div className="h-full w-full px-4 bg-slate-200 py-3 flex flex-col space-y-3">
      {/* Introduction */}
      <Introduction />
      {/* Progress List */}
      <ProgressList />
      {/* Table */}
      <PurchaseOrderList purchaseOrders={poList} isLoading={isPending} />
    </div>
  );
};

export default PurchaseOrderManagement;
