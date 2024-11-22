import photo from '@/assets/images/inspectionReport.jpg';

const InspectionReportIntroduction = () => {
  const title = 'Inspection Report';
  const description = 'Tracks inspections to ensure quality standards.';
  return (
    <div
      className="w-full h-48 bg-white rounded-xl shadow-sm border
      md:h-56">
      <div
        className="grid grid-cols-[2fr_1fr] h-full px-4
        md:px-8 lg:px-12">
        {/* Title and Description */}
        <div className="flex flex-col justify-center h-full w-full">
          <h1
            className="font-primary font-bold text-bluePrimary text-3xl
            md:text-4xl">
            {title}
          </h1>
          <p
            className="text-xs font-primary font-semibold text-slate-400
            md:text-sm lg:text-lg">
            {description}
          </p>
        </div>

        {/* Image */}
        <div className="hidden md:flex pr-8 h-full items-center">
          <img className="h-full object-cover rounded-md" src={photo} alt="Inspection Report" />
        </div>
      </div>
    </div>
  );
};

export default InspectionReportIntroduction;
