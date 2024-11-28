import Introduction from './components/Introduction';
import AnalystSection from './components/AnalystSection';
import ExportReceiptTable from './components/ExportReceiptList';

const ExportReceiptList = () => {
  return (
    <div className="h-full w-full px-4 flex flex-col gap-4">
      <Introduction />
      {/* <AnalystSection /> */}
      <ExportReceiptTable/>
    </div>
  );
};

export default ExportReceiptList;
