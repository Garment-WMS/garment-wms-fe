import React from 'react';
import photo from '@/assets/images/DeliveryNoteIntro.png'
type Props = {};

const Introduction = (props: Props) => {
  const title = 'Import Requests';
  const description = 'Easily update and manage your Import Requests here.';
  return (
    <div className="w-full h-28 bg-white rounded-md
    md:h-48
    ">
      <div className="flex items-center h-full justify-between">
        <div className='flex flex-col justify-center h-full
        md:pl-6 lg:pl-12
        '>
          <h1 className="font-primary font-bold text-bluePrimary text-xl pt-4 pl-4
          md:text-2xl lg:text-3xl xl:text-4xl 
          ">
            {title}
            </h1>
          <p className="text-xs font-primary font-semibold text-slate-400 pl-4
          md:text-md lg:text-lg 
          ">
            {description}
            </p>
        </div>
        <div className= 'h-full hidden md:flex pr-8'>
          <img className=' h-auto' src={photo} />
        </div>
        
      </div>
    </div>
  );
};

export default Introduction;
