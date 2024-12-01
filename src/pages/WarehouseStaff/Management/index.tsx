import WarehouseStaffIntroduction from './components/WarehouseStaffIntroduction';
import WarehouseStaffList from './components/WarehouseStaffList';

const WarehouseStaffManagement = () => {
  return (
    <div className="h-auto w-full px-4 py-3 flex flex-col space-y-3">
      {/* Introduction */}
      <WarehouseStaffIntroduction />
      {/* Warehouse Staff List */}
      <WarehouseStaffList />
    </div>
  );
};

export default WarehouseStaffManagement;
