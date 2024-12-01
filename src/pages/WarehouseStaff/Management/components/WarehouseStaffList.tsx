import TanStackBasicTable from '@/components/common/CompositeTable';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ColumnFiltersState, PaginationState, SortingState } from '@tanstack/react-table';
import { useDebounce } from '@/hooks/useDebouce';
import { CustomColumnDef } from '@/types/CompositeTable';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/DropdownMenu';
import { Button } from '@/components/ui/button';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { get } from '@/api/ApiCaller';
import avatar from '@/assets/images/avatar.png';

const WarehouseStaffList: React.FC = () => {
  const navigate = useNavigate();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const debouncedColumnFilters: ColumnFiltersState = useDebounce(columnFilters, 1000);
  const debouncedSorting: SortingState = useDebounce(sorting, 1000);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 8
  });
  const [warehouseStaffData, setWarehouseStaffData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWarehouseStaff = async () => {
    try {
      const config = get('/account/role/WAREHOUSE_STAFF');
      const response = await fetch(config.url, {
        method: config.method,
        headers: config.headers
      });
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      setWarehouseStaffData(data.data || []);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch warehouse staff.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWarehouseStaff();
  }, []);

  const handleViewClick = (staffId: string) => {
    navigate(`/warehouse-staff/${staffId}`);
  };

  const paginatedTableData =
    warehouseStaffData.length > 0
      ? {
          data: warehouseStaffData,
          limit: pagination.pageSize,
          page: pagination.pageIndex + 1,
          total: warehouseStaffData.length,
          totalFiltered: Math.ceil(warehouseStaffData.length / pagination.pageSize)
        }
      : undefined;

  const warehouseStaffColumns: CustomColumnDef<any>[] = [
    {
      header: 'Avatar',
      accessorKey: 'account.avatarUrl',
      enableColumnFilter: false,
      cell: ({ row }) => {
        const avatarUrl = row.original.account.avatarUrl || avatar;
        return (
          <div className="flex justify-center">
            <img src={avatarUrl} alt="Avatar" className="w-10 h-10 rounded-full object-cover" />
          </div>
        );
      }
    },
    {
      header: 'Username',
      accessorKey: 'account.username',
      cell: ({ row }) => <span className="font-bold">{row.original.account.username}</span>,
      enableColumnFilter: true
    },
    {
      header: 'First Name',
      accessorKey: 'account.firstName',
      cell: ({ row }) => <span>{row.original.account.firstName}</span>,
      enableColumnFilter: true
    },
    {
      header: 'Last Name',
      accessorKey: 'account.lastName',
      cell: ({ row }) => <span>{row.original.account.lastName}</span>,
      enableColumnFilter: true
    },
    {
      header: 'Email',
      accessorKey: 'account.email',
      cell: ({ row }) => <span>{row.original.account.email}</span>,
      enableColumnFilter: true
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const staff = row.original;
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
              <DropdownMenuItem onClick={() => handleViewClick(staff.account.id)}>
                View
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      }
    }
  ];

  return (
    <div className="flex flex-col px-3 pt-3 pb-4 w-auto bg-white rounded-xl shadow-sm border">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-primaryLight">Warehouse Staff List</h1>
      </div>
      {error && <div className="text-red-500 text-center">{error}</div>}
      <div className="overflow-auto h-[700px]">
        <TanStackBasicTable
          isTableDataLoading={isLoading}
          paginatedTableData={paginatedTableData}
          columns={warehouseStaffColumns}
          pagination={pagination}
          setPagination={setPagination}
          sorting={sorting}
          setSorting={setSorting}
          columnFilters={columnFilters}
          setColumnFilters={setColumnFilters}
          totalPages={paginatedTableData?.totalFiltered}
          searchColumnId="account.username"
        />
      </div>
    </div>
  );
};

export default WarehouseStaffList;
