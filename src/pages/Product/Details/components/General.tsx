import { Label } from '@/components/ui/Label';
import React from 'react';
import capitalizeFirstLetter from '@/helpers/capitalizeFirstLetter';
import { ProductVariant } from '@/types/ProductType';
import { Info } from 'lucide-react';

type Props = {
  productVariant: ProductVariant;
};

const General: React.FC<Props> = ({ productVariant }) => {
  if (!productVariant) {
    return (
      <p className="text-center text-lg text-gray-500">
        product Variant data is unavailable.
      </p>
    );
  }
  return (
    <div className="flex flex-col gap-4 ring-1 ring-slate-200 rounded-md p-4">

      <div>
        <Label htmlFor="product-type" className="flex items-center">
        Product: {productVariant?.product?.name}
        </Label>
      </div>
      <div>
        <Label htmlFor="product-type" className="flex items-center">
          Product Code: {productVariant?.code}
        </Label>
      </div>
      <div>
        <Label htmlFor="invoicing-policy" className="flex items-center">
          Unit of measure: {(productVariant?.product?.productUom.name)} 
          {/* {`(${productVariant.product.productUom.uomCharacter})`} */}
        </Label>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex items-center">
          <Label htmlFor="track-inventory" className="flex gap-1">
            Qualified Quantity:  {" "}<span className='text-green-500'>{productVariant?.onHandQualified || 0}</span>  units
          </Label>
          <div className='font-primary'> </div>
        </div>
        <div className="flex items-center">
          <Label htmlFor="track-inventory" className="flex gap-1">
            Disqualified Quantity:  {" "}<span className='text-red-500'>{productVariant?.onHandDisqualified || 0}</span>  units
          </Label>
          <div className='font-primary'> </div>
        </div>
        <p className="text-sm text-gray-500">
          The quantity is based on the import receipt that have the status of Available.
        </p>
      </div>

    </div>
  );
};

export default General;
