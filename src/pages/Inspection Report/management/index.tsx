import InspectionRequestChart from './components/InspectionRequestChart';
import InspectionReportList from './components/InspectionRequestList';
import InspectionReportIntroduction from './components/Introduction';

const InspectionRequestManagement = () => {
  return (
    <div className="h-auto w-full px-4 py-3 flex flex-col space-y-3">
      {/* Introduction */}
      <InspectionReportIntroduction />
      {/* Inspection Statistic */}
      <InspectionRequestChart />
      {/* Inspection Report List */}
      <InspectionReportList />
    </div>
  );
};

export default InspectionRequestManagement;
