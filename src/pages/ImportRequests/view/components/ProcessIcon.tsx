import React from 'react';
import { FaCheck } from 'react-icons/fa';
import { GoPersonFill } from 'react-icons/go';
import { TiArrowSortedDown } from 'react-icons/ti';
import { useMediaQuery } from 'usehooks-ts';

type Props = {
  index: number;
  title: string;
  state: string[];
  isDone: boolean;
  displayStatus: string;
  totalSteps: number;
  onSelect: (index: number) => void;
  isSelected: boolean;
};

const ProcessIcon: React.FC<Props> = (props: Props) => {
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const isLastNode = props.index === props.totalSteps - 1;

  const handleClick = () => {
    props.onSelect(props.index);
  };

  return (
    <>
      {isDesktop ? (
        <li
          onClick={handleClick}
          className={`flex  cursor-pointer relative ${props.isDone ? 'text-bluePrimary' : 'text-slate-500'} ${
            !isLastNode
              ? ' w-full after:w-full after:h-0.5 after:absolute after:bg-slate-500 lg:after:top-4 after:top-3 after:left-[45px]'
              : ''
          } ${props.isDone && !isLastNode ? 'after:bg-bluePrimary' : ''}`}>
          <div className="block whitespace-nowrap z-10 relative">
            <span
              className={`w-6 h-6 lg:w-8 lg:h-8 ${
                props.isDone ? 'bg-bluePrimary' : 'bg-white'
              } ${props.isSelected ? ' border-bluePrimary' : 'border-slate-500'} 
              hover:border-blue-500 border-2 rounded-full flex justify-center items-center mx-auto mb-3 text-sm text-white transition`}>
              {props.isDone ? <FaCheck /> : <GoPersonFill color="black" />}
            </span>
            <div className="flex flex-col items-center justify-center">
              <span className="lg:text-xs md:text-xs font-bold">{props.title}</span>
            </div>
            {props.isSelected && (
              <TiArrowSortedDown className="absolute top-[-25px] left-1/2 transform -translate-x-1/2 text-bluePrimary text-2xl" />
            )}
          </div>
        </li>
      ) : (
        <li
          onClick={handleClick}
          className={`relative flex-1 ${!isLastNode ? 'after:w-0.5 after:h-full after:absolute after:bg-slate-500 after:-bottom-8 after:left-[15px] lg:after:left-5' : ''} ${
            props.isDone && !isLastNode ? 'after:bg-bluePrimary' : ''
          }`}>
          <div className="flex items-center font-medium w-full">
            <span
              className={`w-8 h-8 lg:w-10 lg:h-10 ${
                props.isDone ? 'bg-bluePrimary' : 'text-slate-500'
              } ${props.isSelected ? 'border-bluePrimary' : 'border-slate-500'} 
              border-2 rounded-full flex justify-center items-center mr-3 text-sm text-white hover:border-blue-500 transition`}>
              {props.isDone ? <FaCheck /> : <GoPersonFill color="black" />}
            </span>
            <div className="block relative">
              <div
                className={`text-sm font-primary ${props.isDone ? 'text-bluePrimary' : 'text-slate-500'}`}>
                {props.title}
              </div>
              <div className="text-sm font-primary">{props.displayStatus}</div>
              {props.isSelected && (
                <TiArrowSortedDown className="absolute top-[-20px] left-1/2 transform -translate-x-1/2 text-bluePrimary" />
              )}
            </div>
          </div>
        </li>
      )}
    </>
  );
};

export default ProcessIcon;
