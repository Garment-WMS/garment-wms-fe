import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/DataTable';
import { ProductSize, ProductVariant } from '@/types/ProductType'
import { CaretSortIcon } from '@radix-ui/react-icons';
import { ColumnDef } from '@tanstack/react-table';
import React from 'react'

type Props = {
    productSize: ProductSize[]
  }

  export const DetailsColumn: ColumnDef<ProductSize>[] = [
    {
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            Size Code
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      accessorKey: 'code',
      cell: ({ row }) => <div className="text-left ml-4">{row.original.code}</div> // Center content
    },
    {
      header: ({ column }) => {
        return (
          <div className='flex justify-start'>
            <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            Size name
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
          </div>
          
        );
      },
      accessorKey: 'name',
      enableSorting: true,
      cell: ({ row }) => <div className="text-left ml-4">{row.original.name}</div> // Center content
    },
    {
        header: ({ column }) => {
          return (
            <div className='flex justify-start'>
              <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
              Size
              <CaretSortIcon className="ml-2 h-4 w-4" />
            </Button>
            </div>
            
          );
        },
        accessorKey: 'size',
        enableSorting: true,
        cell: ({ row }) => <div className="text-left ml-4">{row.original.size}</div> // Center content
      },
      {
        header: ({ column }) => {
          return (
            <div className='flex justify-end'>
              <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
              Quantity
              <CaretSortIcon className="ml-2 h-4 w-4" />
            </Button>
            </div>
            
          );
        },
        accessorKey: 'inventoryStock.quantityByPack',
        cell: ({ row }) => {
          const quantity = row.original.inventoryStock ? row.original.inventoryStock.quantityByUom : 0;
          return <div className="text-right mr-8">{quantity}</div>; // Center content
        }
      },
      {
        header: ({ column }) => {
          return (
            <div className='flex justify-start'>
              <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
              Unit of measure
              <CaretSortIcon className="ml-2 h-4 w-4" />
            </Button>
            </div>
            
          );
        },
        accessorKey: 'uom',
        enableSorting: true,
        cell: ({ row }) => <div className="text-left ml-4">{row.original.uom.name}</div> // Center content
      },

    
  ];
  

const SizeTable: React.FC<Props> = ({productSize}) => {
    console.log(productSize)
  return (
    <div className="  ">
      <DataTable columns={DetailsColumn} data={productSize}/>
      <div className="mt-8">
        {/* {materialPackage && <VariantChart materialPackage={materialPackage} />} */}
        {/* <ProductFormula productFormulas={pro}/> */}
      </div>
  </div>
  )
}

export default SizeTable