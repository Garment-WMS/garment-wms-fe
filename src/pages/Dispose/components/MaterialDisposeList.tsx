import { Label } from '@/components/ui/Label';
import { useDebounce } from '@/hooks/useDebouce';
import { useGetMaterialDispose } from '@/hooks/useGetMaterial';
import { ColumnFiltersState, PaginationState, SortingState } from '@tanstack/react-table';
import React, { useEffect, useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/DropdownMenu';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import empty from '@/assets/images/null_placeholder.jpg';
import { Button } from '@/components/ui/button';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { Material, MaterialVariant } from '@/types/MaterialTypes';
import privateCall from '@/api/PrivateCaller';
import { filterType } from '@/types/Shared';
import { toast } from '@/hooks/use-toast';
import { materialTypeApi } from '@/api/services/materialApi';
import { useLocation, useNavigate } from 'react-router-dom';
import TanStackBasicTable from '@/components/common/CompositeTable';
import { CustomColumnDef } from '@/types/CompositeTable';
import CompositeTableWithGrid from '@/pages/Material/management/components/CompositeTableWithGrid';

type Props = {};

const MaterialDisposeList = (props: Props) => {
    const navigate = useNavigate();
  const location = useLocation();
    const [materialType, setMaterialType] = useState<Material[]>([]);
  const [materialTypesToRender, setMaterialTypesToRender] = useState<filterType[]>([]); // Correct initialization
  const fetchMaterialTypes = async () => {
    try {
      const materialTypeResponse = await privateCall(materialTypeApi.getAll());
      const materialTypes = materialTypeResponse.data.data.map((item: Material) => ({
        label: item.name, // This will be used as the label (e.g., "Farbic", "Button")
        value: item.name // This will be used as the value (e.g., the id of the material type)
      }));
      setMaterialTypesToRender(materialTypes);
      setMaterialType(materialTypeResponse.data.data);
    } catch (error) {
      toast({
        variant: 'destructive',
        description: 'Failed to fetch material types',
        title: 'Error'
      });
      console.error('Failed to fetch material types:', error);
    }
  };
  useEffect(() => {
    fetchMaterialTypes();
  }, []);
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

  

  const { materialList, pageMeta, isLoading, isFetching } = useGetMaterialDispose({
    sorting: debouncedSorting,
    columnFilters: debouncedColumnFilters,
    pagination
  })
  const handleViewClick = (requestId: string) => {

    navigate(`/dispose/material-variant/${requestId}`);
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
      header: 'Image',
      accessorKey: 'image',
      enableColumnFilter: false,
      enableSorting: false,
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
      filterOptions: materialTypesToRender.map((type) => ({
        label: type.label, // Correctly access the label
        value: type.value // Correctly access the value
      })),
      cell: ({ row }) => <div>{row.original.material.name}</div>
    },
   
    {
      header: 'Quantity By Uom',
      accessorKey: 'onHand',
      enableColumnFilter: false,
      enableSorting: false,

      cell: ({ row }) => {
        return (
          <div className='flex'>
            <div className=''>{row.original.onHandUom} {" "} {row?.original?.material?.materialUom?.uomCharacter}</div>
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
            <div className=''>{row.original.numberOfMaterialPackage} packages</div>
          </div>
        );
      }
    },
    {
      header: 'Quantity By Package',
      accessorKey: 'onHand',
      enableColumnFilter: false,
      enableSorting: false,

      cell: ({ row }) => {
        return (
          <div className='flex'>
            <div className=''>{row.original.onHand} {" "} {row?.original?.materialPackage[0]?.packUnit || "Units"}</div>
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
  const dataWithPage = materialList && pageMeta && {
    data: materialList,
    limit: pageMeta?.limit || 0,
    page: pageMeta?.page || 0,
    total: pageMeta?.total || 0,
    totalFiltered: pageMeta?.total || 0
  }
  return (
    <div className="w-full  ">
      <div className="p-4">
        <Label className="text-xl font-bold text-bluePrimary">Material Dispose Management</Label>
        <TanStackBasicTable
        isTableDataLoading={isLoading}
        paginatedTableData={dataWithPage}
        columns={materialColumn}
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
  );
};

export default MaterialDisposeList;
