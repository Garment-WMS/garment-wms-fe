import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import KanbanDisplayCard from './KanbanDisplayCard';
import { ColumnFiltersState, PaginationState } from '@tanstack/react-table';
import KanbanSkeleton from './KanbanSkeleton';
import { KanbanDisplayProps } from '@/types/KanbanDisplayType';


const KanbanDisplayList = <TData,>({
  isLoading,
  paginatedData,
}: KanbanDisplayProps<TData>) => {
  const products = paginatedData?.data || [];
console.log('ds',paginatedData)

  return (
    <div className="container px-2 py-2">
      {isLoading ? (
        <KanbanSkeleton />
      ) : (
        <>
        {paginatedData  ? (
          <div className="container  px-2">

          <div className="grid grid-cols-1 gap-4 h-80 overflow-auto">
            {products.map((product) => (
              <KanbanDisplayCard product={product} />
            ))}
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
