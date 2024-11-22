import Introduction from './components/Introduction';
import AnalystSection from './components/AnalystSection';
import ExportRequestTable from './components/ExportRequestList';

const ExportRequestList = () => {
  return (
    <div className="h-full w-full px-4 flex flex-col gap-4">
      <Introduction />
      <AnalystSection />
      <ExportRequestTable />
    </div>
  );
};

export default ExportRequestList;
