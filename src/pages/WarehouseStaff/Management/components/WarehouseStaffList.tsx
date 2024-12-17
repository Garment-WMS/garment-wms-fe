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
import privateCall from '@/api/PrivateCaller';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/Select';
import avatar from '@/assets/images/avatar.png';
import { AddStaffPopup } from './add-staff-popup';

const Role = [
  { value: 'WAREHOUSE_STAFF', label: 'Warehouse Staff' },
  { value: 'PURCHASING_STAFF', label: 'Purchasing Staff' },
  { value: 'PRODUCTION_DEPARTMENT', label: 'Production Department' },
  { value: 'INSPECTION_DEPARTMENT', label: 'Inspection Department' }
];

const WarehouseStaffList: React.FC = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<string>('WAREHOUSE_STAFF');
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

  const fetchWarehouseStaff = async (role: string) => {
    try {
      setIsLoading(true);
      const config = get(`/account/role/${role}`);
      const response = await privateCall({
        method: config.method,
        url: config.url,
        headers: config.headers,
        params: config.params
      });
      setWarehouseStaffData(response.data?.data || []);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWarehouseStaff(selectedRole);
  }, [selectedRole]);

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
          <div className="flex">
            <img src={avatarUrl} alt="Avatar" className="w-10 h-10 rounded-full object-cover" />
          </div>
        );
      }
    },
    {
      header: 'Full Name',
      accessorKey: 'account.firstName',
      enableColumnFilter: false,
      cell: ({ row }) => (
        <span className="font-bold">
          {row.original.account.lastName + ' ' + row.original.account.firstName}
        </span>
      )
    },
    {
      header: 'Email',
      accessorKey: 'account.email',
      enableColumnFilter: false,
      cell: ({ row }) => <span className="text-blue-500">{row.original.account.email}</span>
    },
    {
      header: 'Username',
      accessorKey: 'account.username',
      enableColumnFilter: false,
      cell: ({ row }) => <span>{row.original.account.username}</span>
    },
    {
      header: 'Gender',
      accessorKey: 'account.gender',
      enableColumnFilter: false,
      cell: ({ row }) => <span>{row.original.account.gender}</span>
    },
    {
      header: 'Phone number',
      accessorKey: 'account.phoneNumber',
      enableColumnFilter: false,
      cell: ({ row }) => <span>{row.original.account.phoneNumber}</span>
    },
    {
      header: 'Created on',
      accessorKey: 'account.createdAt',
      enableColumnFilter: false,
      cell: ({ row }) => (
        <span>
          {new Date(row.original.account.createdAt).toLocaleString('en-GB', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          })}
        </span>
      )
    },
    {
      id: 'actions',
      enableHiding: false,
      enableColumnFilter: false,
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
        <AddStaffPopup />
        <div className="w-64">
          <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select Role" />
            </SelectTrigger>
            <SelectContent>
              {Role.map((role) => (
                <SelectItem key={role.value} value={role.value}>
                  {role.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
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
