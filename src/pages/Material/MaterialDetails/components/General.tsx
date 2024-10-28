import { Label } from '@/components/ui/Label';
import { Material, MaterialVariant } from '@/types/MaterialTypes';
import React from 'react';
import VariantChart from './VariantChart';

type Props = {
  materialVariant: MaterialVariant;
};

const General: React.FC<Props> = ({ materialVariant }) => {
  console.log(materialVariant)
  if (!materialVariant) {
    return (
      <p className="text-center text-lg text-gray-500">
        Material Variant data is unavailable.
      </p>
    );
  }
  return (
    <div className="flex flex-col gap-4">
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
          Unit of measure: {materialVariant?.material?.materialUom.name}
        </Label>
      </div>
      <div className="col-span-2">
        {/* <Label htmlFor="track-inventory" className="flex items-center">
    Track Inventory <Info className="w-4 h-4 ml-1 text-gray-400" />
  </Label> */}
        <div className="flex items-center mt-2">
          <Label htmlFor="track-inventory" className="">
            Quantity: {materialVariant?.onHand} unit
          </Label>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          The quantity is based on the actual import not the delivery order.
        </p>
      </div>
      <div className="mt-4">
        {materialVariant?.materialPackage && <VariantChart materialPackage={materialVariant.materialPackage} />}
      </div>
    </div>
  );
};

export default General;
