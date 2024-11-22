import photo from '@/assets/images/productionBatch.svg';

const ProductionBatchIntroduction = () => {
  const title = 'Production Batch';
  const description = 'Monitors and manages production batches efficiently.';
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
        <div className="flex flex-col justify-center h-full w-3/4 md:w-2/3">
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
        <div className="h-full flex justify-end items-center w-1/4 md:w-1/3">
          <img className="h-full object-contain" src={photo} alt="Production Batch" />
        </div>
      </div>
    </div>
  );
};

export default ProductionBatchIntroduction;
