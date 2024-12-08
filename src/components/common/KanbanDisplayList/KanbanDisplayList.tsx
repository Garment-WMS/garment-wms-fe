import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import KanbanDisplayCard from './KanbanDisplayCard';
import { ColumnFiltersState, PaginationState } from '@tanstack/react-table';
import { KanbanDisplayProps } from '@/types/KanbanDisplayType';
import KanbanSkeleton from './KanbanSkeleton';
import { ScrollRestoration } from 'react-router-dom';


const KanbanDisplayList = <TData,>({
  isLoading,
  paginatedData,

 
}: KanbanDisplayProps<TData>) => {
  const products = paginatedData?.data || [];


  return (
    <div className="container mx-auto p-4">
      {isLoading ? (
        <KanbanSkeleton />
      ) : (
        <>
        {paginatedData  ? (
          <div className="container mx-auto p-4">

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
