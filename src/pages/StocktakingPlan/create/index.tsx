import { Label } from '@/components/ui/Label';
import React, { useState } from 'react';
import OverallPlan from '@/assets/images/OverallPlan.png';
import DynamicPlan from '@/assets/images/DynamicPlan.png';
import { useNavigate } from 'react-router-dom';
const CreateStocktakingPlan: React.FC = () => {
const navigate = useNavigate();


  return (
    <div className="flex flex-col mx-auto p-4 bg-white shadow-sm border rounded-md">
      <Label className="text-2xl font-primary font-bold">Planning stocktaking</Label>
      <Label className="text-md font-primary text-bluePrimary font-bold mt-2 flex justify-center items-center">Select type</Label>

      <div className="flex justify-between mt-4">
        {/* Option 1 */}
        <div
          className="w-1/2 p-4 border rounded-md m-2 flex flex-col justify-center items-center hover:ring-2 hover:ring-bluePrimary"
            onClick={() => navigate('/stocktaking/plan/create/overall')}
        >
          <img
            src={OverallPlan}
            alt="Option 1"
            className="w-2/3 h-full object-contain"
          />
          <div className='flex flex-col  justify-center items-center gap-2'>
            <Label className="text-center mt-2 text-xl font-primary font-bold text-bluePrimary">Overall plan</Label>
            <Label className="text-center text-sm font-primary font-bold text-slate-400">
                In this plan it is required to check all the items in the inventory
            </Label>

          </div>
          
        </div>

        {/* Option 2 */}
        <div
          className="w-1/2 p-4 border rounded-md m-2 flex flex-col justify-center items-center hover:ring-2 hover:ring-bluePrimary"

        >
          <img
            src={DynamicPlan}
            alt="Option 2"
            className="w-2/3 h-full object-contain"
            onClick={() => navigate('/stocktaking/plan/create/dynamic')}
          />
          <div className='flex flex-col  justify-center items-center gap-2'>
            <Label className="text-center mt-2 text-xl font-primary font-bold text-bluePrimary">Dynamic plan</Label>
            <Label className="text-center text-sm font-primary font-bold text-slate-400">
                In this plan manager can choose which items to check
            </Label>

          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateStocktakingPlan;
