import React, { useEffect, useState } from 'react';
import KanbanDisplayList from '../../../../components/common/KanbanDisplayList/KanbanDisplayList';
import { Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ColumnFiltersState, PaginationState, SortingState } from '@tanstack/react-table';
import { useDebounce } from '@/hooks/useDebouce';
import { getAllMaterialFn, materialTypeApi } from '@/api/services/materialApi';
import { Material, MaterialDataToRender, MaterialVariant } from '@/types/MaterialTypes';
import { toast } from '@/hooks/use-toast';
import { PageMetaData } from '@/types/ImportRequestType';
import CompositeTableWithGrid from './CompositeTableWithGrid';
import { useLocation, useNavigate } from 'react-router-dom';
import { CustomColumnDef } from '@/types/CompositeTable';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/DropdownMenu';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import axios from 'axios';
import { useGetMaterial } from '@/hooks/useGetMaterial';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import empty from '@/assets/images/null_placeholder.jpg';
import { TypeChart } from './TypeChart';
import { Label } from '@/components/ui/Label';

type Props = {
  materialTypes :filterType[]
};
interface filterType {
  label: string;
  value: string;
}
const MaterialManagementData: React.FC<Props> = ({
  materialTypes
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  // sorting state of the table
  const [sorting, setSorting] = useState<SortingState>([]);
  // column filters state of the table
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const debouncedColumnFilters: ColumnFiltersState = useDebounce(columnFilters, 1000);

  const debouncedSorting: SortingState = useDebounce(sorting, 1000);
  // pagination state of the table
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0, //initial page index
    pageSize: 9 //default page size
  });

  const debouncedPagination: PaginationState = useDebounce(pagination, 1000);
  

  const { materialList, pageMeta, isLoading, isFetching } = useGetMaterial({
    sorting: debouncedSorting,
    columnFilters: debouncedColumnFilters,
    pagination
  })

  const dataWithPage = materialList && pageMeta && {
    data: materialList,
    limit: pageMeta?.limit || 0,
    page: pageMeta?.page || 0,
    total: pageMeta?.total || 0,
    totalFiltered: pageMeta?.total || 0
  }

  const handleViewClick = (requestId: string) => {
    const basePath = location.pathname.split('/material')[0]; // Get base path (either manager or purchase-staff)

    // Navigate to the new route
    navigate(`${basePath}/material-variant/${requestId}`);
  };
  const materialColumn: CustomColumnDef<MaterialVariant>[] = [
    {
      header: 'Material code',
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
      header: 'Material name',
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
      header: 'Material',
      accessorKey: 'material.name',
      enableColumnFilter: true,
      filterOptions: materialTypes.map((type) => ({
        label: type.label, // Correctly access the label
        value: type.value // Correctly access the value
      })),
      cell: ({ row }) => <div>{row.original.material.name}</div>
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
      header: 'Package Quantity',
      accessorKey: 'numberOfMaterialPackage',
      enableColumnFilter: false,
      enableSorting: false,
      cell: ({ row }) => {
        return (
          <div className='flex'>
            <div className=''>{row.original.numberOfMaterialPackage}</div>
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
  ];
  return (
    <div className="w-full  bg-white rounded-xl shadow-sm border">
      <div className='p-4'>
        <Label className="text-2xl ">Material Management</Label>
      </div>
      <CompositeTableWithGrid
        isTableDataLoading={isLoading}
        paginatedTableData={dataWithPage}
        columns={materialColumn}
        pagination={pagination}
        sorting={sorting}
        setSorting={setSorting}
        setPagination={setPagination}
        columnFilters={columnFilters}
        setColumnFilters={setColumnFilters}
      />
    </div>
  );
};

export default MaterialManagementData;
