import React, { Dispatch, SetStateAction, useEffect } from 'react';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import {
  MaterialDetailsToRender,
  ProductDetailsToRender
} from '@/types/InventoryReport';
import { DetailsToApproveChange } from '..';
import ReceiptDialog from './ReceiptDialog';

type Props = {
  materialDetails: MaterialDetailsToRender[];
  productDetails: ProductDetailsToRender[];
  approvedDetails: DetailsToApproveChange;
  setApprovedDetails: Dispatch<SetStateAction<DetailsToApproveChange>>;
};

const SearchFunction = ({
  materialDetails,
  productDetails,
  approvedDetails,
  setApprovedDetails
}: Props) => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<any>();
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null); // Track error messages

  const handleSearch = () => {
    const formattedQuery = query.trim();
    setError(null);

    for (const material of materialDetails) {
      for (const materialPackage of material.materialPackages) {
        for (const detail of materialPackage.inventoryReportDetails) {
          if (detail.materialReceipt.code === formattedQuery) {
            setResult(detail);
 
                setIsOpen(true);
              
            return; 
          }
        }
      }
    }

    for (const product of productDetails) {
      for (const productPackage of product.productSizes) {
        for (const detail of productPackage.inventoryReportDetails) {
          if (detail.productReceipt.code === formattedQuery) {
            setResult(detail);
            setIsOpen(true);

            return;
          }
        }
      }
    }

    // No match found
    setResult(null);
    setError('No receipt found with the provided code.'); 

  };

//   useEffect(() => {
//     if (result) {
//       setIsOpen(true);
//     }
//   }, [result]);
  return (
    <div className="max-w-2xl my-4">
        <div className='mb-4'>
           <div className="flex space-x-2">
        <Input
          type="text"
          placeholder="Search receipt code"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          className="flex-grow"
        />
        <Button onClick={handleSearch}>
          <Search className="mr-2 h-4 w-4" /> Search
        </Button>
      </div>
      {error && ( // Conditionally render the error message
        <div className="text-red-500 text-sm">
          {error}
        </div>
      )} 
        </div>
      

      <ReceiptDialog
        open={isOpen}
        setOpen={setIsOpen}
        result={result}
        approvedDetails={approvedDetails}
        setApprovedDetails={setApprovedDetails}/>
    </div>
  );
};

export default SearchFunction;
