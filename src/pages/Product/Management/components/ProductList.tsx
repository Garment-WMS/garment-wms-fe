import { AspectRatio } from '@/components/ui/aspect-ratio';
import { useDebounce } from '@/hooks/useDebouce';
import { useGetProductVariants } from '@/hooks/useGetProductVariants';
import { CustomColumnDef } from '@/types/CompositeTable';
import { ProductVariant } from '@/types/ProductType';
import { filterType } from '@/types/Shared';
import { ColumnFiltersState, PaginationState, SortingState } from '@tanstack/react-table';
import React, { useState } from 'react'
import empty from '@/assets/images/null_placeholder.jpg';
import { useNavigate } from 'react-router-dom';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/DropdownMenu';
import { Button } from '@/components/ui/button';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { Label } from '@/components/ui/Label';
import CompositeTableWithGrid from './CompositeTableWithGrid';

type Props = {
  productTypes :filterType[]
};

const ProductList: React.FC<Props> = ({productTypes}) => {
  const navigate = useNavigate();

  // sorting state of the table
  const [sorting, setSorting] = useState<SortingState>([]);
  // column filters state of the table
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const debouncedColumnFilters: ColumnFiltersState = useDebounce(columnFilters, 1000);

  const debouncedSorting: SortingState = useDebounce(sorting, 1000);
  // pagination state of the table
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0, //initial page index
    pageSize: 10 //default page size
  });

  const { productList, pageMeta, isLoading, isFetching } = useGetProductVariants({
    sorting: debouncedSorting,
    columnFilters: debouncedColumnFilters,
    pagination
  })

  const dataWithPage = productList && pageMeta && {
    data: productList,
    limit: pageMeta?.limit || 0,
    page: pageMeta?.page || 0,
    total: pageMeta?.total || 0,
    totalFiltered: pageMeta?.total || 0
  }
  const handleViewClick = (requestId: string) => {

    navigate(`/product-variant/${requestId}`);
  };
  const productColumn: CustomColumnDef<ProductVariant>[]=[
    {
      header: 'Product code',
      accessorKey: 'code',
      enableColumnFilter: false,
      cell: ({ row }) => {
        return (
          <div>
            <div>{row.original.code}</div>
          </div>
        );
      }
    },
    {
      header: 'Product name',
      accessorKey: 'name',
      enableColumnFilter: false,
      cell: ({ row }) => {
        return (
          <div>
            <div>{row.original.name}</div>
          </div>
        );
      }
    },
    {
      header: 'Product',
      accessorKey: 'product.name',
      enableColumnFilter: true,
      filterOptions: productTypes.map((type) => ({
        label: type.label, // Correctly access the label
        value: type.value // Correctly access the value
      })),
      cell: ({ row }) => <div>{row.original.product.name}</div>
    },
    {
      header: 'Quantity',
      accessorKey: 'onHand',
      enableColumnFilter: false,
      enableSorting: false,

      cell: ({ row }) => {
        return (
          <div className='flex'>
            <div className=''>{row.original.onHand}</div>
          </div>
        );
      }
    },
    {
      header: 'Number of Size',
      accessorKey: 'numberOfMaterialPackage',
      enableColumnFilter: false,
      enableSorting: false,
      cell: ({ row }) => {
        return (
          <div className='flex'>
            <div className=''>{row.original.productSize.length}</div>
          </div>
        );
      }
    },
    {
      header: 'Image',
      accessorKey: 'image',
      enableColumnFilter: false,
      cell: ({ row }) => {
        return (
          <div className='w-10 h-10'>
            {row.original.image ? (
                <AspectRatio ratio={16 / 9}>
                  <img src={row.original.image}  className="object-cover rounded" />
                </AspectRatio>
              ) : (
                <AspectRatio ratio={16 / 9}>
                  <img src={empty} className="object-cover rounded" />
                </AspectRatio>
              )}
          </div>
        );
      }
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const request = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <DotsHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => handleViewClick(request.id)}>View</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      }
    }
  ]
  return (
    <div className='w-full  bg-white rounded-xl shadow-sm border p-4'>
        <div className='p-4'>
        <Label className="text-2xl ">Product Management</Label>
      </div>
      <CompositeTableWithGrid
        isTableDataLoading={isLoading}
        paginatedTableData={dataWithPage}
        columns={productColumn}
        pagination={pagination}
        sorting={sorting}
        setSorting={setSorting}
        setPagination={setPagination}
        columnFilters={columnFilters}
        setColumnFilters={setColumnFilters}
      />
    </div>
  )
}

export default ProductList