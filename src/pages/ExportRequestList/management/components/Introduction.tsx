import Report from '@/assets/images/Report.svg';
type Props = {};

const Introduction = (props: Props) => {
  const title = 'Export Request';
  const description = 'Material Export for manufacturing.';
  return (
    <div
      className="w-full h-32 bg-white rounded-xl shadow-sm border
    md:h-48
    ">
      <div className="flex items-center h-full justify-between">
        <div
          className="flex flex-col justify-center h-full
        md:pl-6 lg:pl-12
        ">
          <h1
            className="font-primary font-bold text-bluePrimary text-xl pt-4 pl-4
          md:text-2xl lg:text-3xl xl:text-4xl 
          ">
            {title}
          </h1>
          <p
            className="text-xs font-primary font-semibold text-slate-400 pl-4
          md:text-md lg:text-lg 
          ">
            {description}
          </p>
        </div>
        <div className="h-full hidden md:flex pr-8">
          <img className=" h-auto w-full" src={Report} />
        </div>
      </div>
    </div>
  );
};

export default Introduction;
