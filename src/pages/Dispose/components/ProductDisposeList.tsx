import privateCall from '@/api/PrivateCaller';
import { productApi } from '@/api/services/productApi';
import { useDebounce } from '@/hooks/useDebouce';
import { useGetProductVariants, useGetProductVariantsDispose } from '@/hooks/useGetProductVariants';
import { Product, ProductVariant } from '@/types/ProductType';
import { filterType } from '@/types/Shared';
import { ColumnFiltersState, PaginationState, SortingState } from '@tanstack/react-table';
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/DropdownMenu';
import { CustomColumnDef } from '@/types/CompositeTable';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import empty from '@/assets/images/null_placeholder.jpg';
import { Button } from '@/components/ui/button';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { Label } from '@/components/ui/Label';
import TanStackBasicTable from '@/components/common/CompositeTable';

type Props = {}

const ProductDisposeList = (props: Props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [productType, setProductType] = useState<Product[]>([]);
  const [productTypesToRender, setProductTypesToRender] = useState<filterType[]>([]);
  const fetchProductTypes = async () => {
    try {
      const res = await privateCall(productApi.getAllProduct());
      const data = res.data.data.data;
      const productTypes = data.map((item: Product) => ({
        label: item.name,
        value: item.name
      }));
      setProductTypesToRender(productTypes);
      setProductType(data);
    } catch (error) {
      console.error('Failed to fetch product types:', error);
    }
  };
  useEffect(() => {
    fetchProductTypes();
  }, []);
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
  const { productList, pageMeta, isLoading, isFetching } = useGetProductVariantsDispose({
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

    navigate(`/dispose/product-variant/${requestId}`);
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
      filterOptions: productTypesToRender.map((type) => ({
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
    <div className='w-full '>
      <div className='p-4'>
        <Label className="text-xl font-bold text-bluePrimary">Product Dispose Management</Label>
        <TanStackBasicTable
        isTableDataLoading={isLoading}
        paginatedTableData={dataWithPage}
        columns={productColumn}
        pagination={pagination}
        sorting={sorting}
        setSorting={setSorting}
        setPagination={setPagination}
        columnFilters={columnFilters}
        setColumnFilters={setColumnFilters}
          searchColumnId='code'
        searchPlaceholder='Search by code'
      />
      </div>
      
    </div>
  )
}

export default ProductDisposeList