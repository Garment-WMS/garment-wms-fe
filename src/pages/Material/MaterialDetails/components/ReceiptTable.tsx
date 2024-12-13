import React, { useEffect, useState } from 'react';
import { ReceiptChart } from './ReceiptChart';
import { ColumnFiltersState, PaginationState, SortingState } from '@tanstack/react-table';
import { useDebounce } from '@/hooks/useDebouce';
import TanStackBasicTable from '@/components/common/CompositeTable';
import { Label } from '@/components/ui/Label';
import { useGetMaterialReceipt } from '@/hooks/useGetMaterial';
import { MaterialReceipt, ReceiptStatusLabel } from '@/types/MaterialTypes';
import { CustomColumnDef } from '@/types/CompositeTable';
import { badgeVariants } from '@/components/ui/Badge';
import capitalizeFirstLetter from '@/helpers/capitalizeFirstLetter';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/DropdownMenu';
import { Button } from '@/components/ui/button';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import ReceiptDetailsDialog from './ReceiptDetailsDialog';
type Props = {
  id: string;
  receiptId: string | null;
};
const ReceiptTable: React.FC<Props> = ({ id, receiptId }) => {
  const [selectedReceiptId, setSelectedReceiptId] = useState<string | null>(null);
  const [isOpened, setIsOpened] = useState(false);
  const getStatusBadgeVariant = (status: string) => {
    const statusObj = ReceiptStatusLabel.find((s) => s.value === status);
    return statusObj ? statusObj.variant : 'default'; // Default variant if no match is found
  };
  const openDialog = (id: string) => {
    setSelectedReceiptId(id);
    setIsOpened(true);
  };

  useEffect(() => {
    if (receiptId) {
      openDialog(receiptId);
    }
  }, [receiptId]);
  // // Function to close the dialog
  // const closeDialog = () => {
  //   setSelectedReceiptId(null); // Reset the ID
  // };
  const materialImportReceiptColumn: CustomColumnDef<MaterialReceipt>[] = [
    {
      header: 'Receipt code',
      accessorKey: 'code',
      enableColumnFilter: false,
      cell: ({ row }) => {
        return (
          <div>
            <div>{row.original?.code}</div>
          </div>
        );
      }
    },
    {
      header: 'Material Package code',
      accessorKey: 'materialPackage.code',
      enableColumnFilter: false,
      cell: ({ row }) => {
        return (
          <div>
            <div>{row.original?.materialPackage?.code}</div>
          </div>
        );
      }
    },
    {
      header: 'Material Package name',
      accessorKey: 'materialPackage.name',
      enableColumnFilter: false,
      cell: ({ row }) => {
        return (
          <div>
            <div>{row.original?.materialPackage?.name}</div>
          </div>
        );
      }
    },
    {
      header: 'Import Date',
      accessorKey: 'importDate',
      enableColumnFilter: false,
      cell: ({ row }) => {
        const dateString = row.original?.importDate;
        if (!dateString) {
          return <div>N/A</div>;
        }
        const date = new Date(dateString);
        const formattedDate = date.toLocaleDateString('en-GB', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        });
        return (
          <div>
            <div>{formattedDate}</div>
          </div>
        );
      }
    },
    // {
    //   header: 'Material',
    //   accessorKey: 'material.name',
    //   enableColumnFilter: true,
    //   filterOptions: materialTypes.map((type) => ({
    //     label: type.label, // Correctly access the label
    //     value: type.value // Correctly access the value
    //   })),
    //   cell: ({ row }) => <div>{row.original.material.name}</div>
    // },
    {
      header: 'Import Quantity',
      accessorKey: 'quantityByPack',
      enableColumnFilter: false,
      cell: ({ row }) => {
        return (
          <div className="flex">
            <div className="">{row.original?.quantityByPack}</div>
          </div>
        );
      }
    },
    {
      header: 'Remain Quantity',
      accessorKey: '',
      enableColumnFilter: false,
      cell: ({ row }) => {
        return (
          <div className="flex">
            <div className="">{row.original?.remainQuantityByPack}</div>
          </div>
        );
      }
    },
    {
      header: 'Status',
      accessorKey: 'status',
      enableColumnFilter: true,
      cell: ({ row }) => (
        <div
          className={badgeVariants({ variant: getStatusBadgeVariant(row.original?.status ?? '') })}>
          {capitalizeFirstLetter(row.original?.status ?? 'N/A')}
        </div>
      ),
      filterOptions: ReceiptStatusLabel.map((status) => ({
        label: status.label,
        value: status.value
      }))
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
              <DropdownMenuItem onClick={() => openDialog(request.id)}>View</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      }
    }
  ];
  if (!id) {
    return (
      <div>
        <h1>No Material Receipt </h1>
      </div>
    );
  }

  const [importColumnFilters, setImportColumnFilters] = useState<ColumnFiltersState>([]);

  const [importSorting, setImportSorting] = useState<SortingState>([]);

  const importDebouncedColumnFilters: ColumnFiltersState = useDebounce(importColumnFilters, 1000);

  const importDebouncedSorting: SortingState = useDebounce(importSorting, 1000);

  const [importPagination, setImportPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5
  });

  const {
    pageMeta: importPageMeta,
    receiptData,
    isLoading: isImportLoading
  } = useGetMaterialReceipt(id, {
    sorting: importDebouncedSorting,
    columnFilters: importDebouncedColumnFilters,
    pagination: importPagination
  });

  const importData = receiptData &&
    importPageMeta && {
      data: receiptData,
      limit: importPageMeta?.limit || 0,
      page: importPageMeta?.page || 0,
      total: importPageMeta?.total || 0,
      totalFiltered: importPageMeta?.total || 0
    };

  return (
    <div className=" flex flex-col gap-4 ">
      <div className="h-full">
        <div className="">
          <Label>Material Receipt</Label>
          <TanStackBasicTable
            isTableDataLoading={isImportLoading}
            paginatedTableData={importData}
            columns={materialImportReceiptColumn}
            pagination={importPagination}
            sorting={importSorting}
            setSorting={setImportSorting}
            setPagination={setImportPagination}
            columnFilters={importColumnFilters}
            setColumnFilters={setImportColumnFilters}
            searchColumnId="code"
            searchPlaceholder="Search by code"
          />
        </div>
      </div>

      {selectedReceiptId && (
        <ReceiptDetailsDialog id={selectedReceiptId} isOpen={isOpened} setIsOpen={setIsOpened} />
      )}
    </div>
  );
};

export default ReceiptTable;
