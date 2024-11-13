import Introduction from './components/Introduction';
import PurchaseOrderList from './components/PurchaseOrderList';
import ProgressChart from './components/ProgressChart';

const PurchaseOrderManagement = () => {
  return (
    <div className="h-auto w-full px-4 py-3 flex flex-col space-y-3">
      {/* Introduction */}
      <Introduction />
      {/* Pie Chart */}
      <ProgressChart />
      {/* Table */}
      <PurchaseOrderList />
    </div>
  );
};

export default PurchaseOrderManagement;
