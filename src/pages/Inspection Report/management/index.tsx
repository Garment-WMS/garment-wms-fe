import InspectionReportList from './components/InspectionReportList';
import InspectionReportIntroduction from './components/Introduction';

const InspectionReportManagement = () => {
  return (
    <div className="h-auto w-full px-4 py-3 flex flex-col space-y-3">
      {/* Introduction */}
      <InspectionReportIntroduction />
      {/* Inspection Report List */}
      <InspectionReportList />
    </div>
  );
};

export default InspectionReportManagement;
