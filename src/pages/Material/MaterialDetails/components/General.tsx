import { Label } from '@/components/ui/Label';
import { Material, MaterialVariant } from '@/types/MaterialTypes';
import React from 'react';
import VariantChart from './VariantChart';
import capitalizeFirstLetter from '@/helpers/capitalizeFirstLetter';

type Props = {
  materialVariant: MaterialVariant;
};

const General: React.FC<Props> = ({ materialVariant }) => {
  if (!materialVariant) {
    return (
      <p className="text-center text-lg text-gray-500">
        Material Variant data is unavailable.
      </p>
    );
  }
  return (
    <div className="flex flex-col gap-4 ring-1 ring-slate-200 rounded-md p-4">

      <div>
        <Label htmlFor="product-type" className="flex items-center">
        Material: {materialVariant?.material?.name}
        </Label>
      </div>
      <div>
        <Label htmlFor="product-type" className="flex items-center">
          Material Code: {materialVariant?.code}
        </Label>
      </div>
      <div>
        <Label htmlFor="invoicing-policy" className="flex items-center">
          Unit of measure: {capitalizeFirstLetter(materialVariant?.material?.materialUom.name)} {`(${materialVariant.material.materialUom.uomCharacter})`}
        </Label>
      </div>
      <div className="col-span-2">
        {/* <Label htmlFor="track-inventory" className="flex items-center">
    Track Inventory <Info className="w-4 h-4 ml-1 text-gray-400" />
  </Label> */}
        <div className="flex items-center">
          <Label htmlFor="track-inventory" className="flex">
            Quantity:  {" "}{materialVariant?.onHand} {materialVariant?.materialPackage[0]? capitalizeFirstLetter(materialVariant?.materialPackage[0].packUnit): "units"}
          </Label>
          <div className='font-primary'> </div>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          The quantity is based on the import receipt that have the status of Available.
        </p>
      </div>

    </div>
  );
};

export default General;
