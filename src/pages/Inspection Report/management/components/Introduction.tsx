import photo from '@/assets/images/inspectionReport.jpg';

const InspectionReportIntroduction = () => {
  const title = 'Inspection Report';
  const description = 'Tracks inspections to ensure quality standards.';
  return (
    <div
      className="w-full h-28 bg-white rounded-xl shadow-sm border
md:h-48
">
      <div
        className="flex items-center h-full justify-between px-4
md:px-8 lg:px-12
">
        {/* Title and Description */}
        <div className="flex flex-col justify-center h-full w-full">
          <h1
            className="font-primary font-bold text-bluePrimary text-xl
md:text-2xl lg:text-3xl xl:text-4xl
">
            {title}
          </h1>
          <p
            className="text-xs font-primary font-semibold text-slate-400
md:text-md lg:text-lg
">
            {description}
          </p>
        </div>

        {/* Image */}
        <div className="h-full flex justify-end py-3">
          <img className="h-auto" src={photo} alt="Inspection Report" />
        </div>
      </div>
    </div>
  );
};

export default InspectionReportIntroduction;
