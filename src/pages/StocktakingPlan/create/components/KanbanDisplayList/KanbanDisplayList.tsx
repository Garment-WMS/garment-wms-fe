import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import KanbanDisplayCard from './KanbanDisplayCard';
import { ColumnFiltersState, PaginationState } from '@tanstack/react-table';
import KanbanSkeleton from './KanbanSkeleton';
import { UseGetTableResponseType } from '@/types/CompositeTable';
export interface CustomKanbanDisplayProps<TData> {
  isLoading: boolean;
  paginatedData?: UseGetTableResponseType<TData>;
  setSelectedItems: any;
  selectedItems?:any
}

const KanbanDisplayList = <TData,>({
  isLoading,
  paginatedData,
  setSelectedItems,
  selectedItems
}: CustomKanbanDisplayProps<TData>) => {
  const products: any = paginatedData?.data || [];

  return (
    <div className="container px-2 py-2">
      {isLoading ? (
        <KanbanSkeleton />
      ) : (
        <>
        {paginatedData  ? (
          <div className="container  px-2">

          <div className="flex flex-col gap-4 h-[440px] overflow-auto">
          {products.map((product: any) => {
                  const isChosen = selectedItems.some(
                    (item: any) => item.id === product?.id
                  );
                  return (
                    <KanbanDisplayCard
                      key={product.id}
                      onSelectItem={setSelectedItems}
                      product={product}
                      isChoosen={isChosen} // Pass isChosen prop
                    />
                  );
                })}
          </div>
        </div>
        ):(
          <div className='h-[400px] bg-white'>
          <div>
            <div className="flex justify-center items-center mt-4">
              <p className="text-center">No Data</p>
            </div>
          </div>
          </div>
        )}
        </>
        
      )}
    </div>
  );
};

export default KanbanDisplayList;
