import Introduction from './components/Introduction';
import AnalystSection from './components/AnalystSection';
import ImportReceiptTable from './components/ImportReceiptList';

const WarehouseStaffImportReceiptList = () => {
  return (
    <div className="h-full w-full px-4 flex flex-col gap-4">
      <Introduction />
      {/* <AnalystSection /> */}
      <ImportReceiptTable />
    </div>
  );
};

export default WarehouseStaffImportReceiptList;
