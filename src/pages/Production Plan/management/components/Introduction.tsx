import photo from '@/assets/images/productionPlan.jpg';

const ProductionPlanIntroduction = () => {
  const title = 'Production Plan';
  const description = 'Monitors schedules and ensures efficient resource use.';

  return (
    <div className="w-full h-48 bg-white rounded-xl shadow-sm border md:h -48">
      <div className="flex items-center w-full h-full justify-between">
        <div className="flex flex-col justify-center h-full md:pl-6 lg:pl-12">
          <h1 className="font-primary font-bold text-bluePrimary text-xl pt-4 pl-4 md:text-2xl lg:text-3xl xl:text-4xl">
            {title}
          </h1>
          <p className="text-xs font-primary font-semibold text-slate-400 pl-4 md:text-md lg:text-lg">
            {description}
          </p>
        </div>
        <div className="h-full  pr-8 flex justify-end w-auto">
          <img className=" h-auto" src={photo} />
        </div>
      </div>
    </div>
  );
};

export default ProductionPlanIntroduction;
