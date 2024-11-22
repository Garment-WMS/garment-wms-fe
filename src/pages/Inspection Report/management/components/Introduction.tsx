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
        className="grid grid-cols-[2fr_1fr] h-full  px-4
md:px-8 lg:px-12
">
        {/* Title and Description */}
        <div className="flex flex-col justify-center h-full w-full">
          <h1
            className="font-primary font-bold text-bluePrimary text-4xl
  ]
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
        <div className="h-full hidden md:flex pr-8">
          <img className=" h-auto" src={photo} />
        </div>
      </div>
    </div>
  );
};

export default InspectionReportIntroduction;
