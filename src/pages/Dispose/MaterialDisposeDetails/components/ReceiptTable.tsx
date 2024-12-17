import React, { useEffect, useState } from 'react';
import { ReceiptChart } from './ReceiptChart';
import { ColumnFiltersState, PaginationState, SortingState } from '@tanstack/react-table';
import { useDebounce } from '@/hooks/useDebouce';
import TanStackBasicTable from '@/components/common/CompositeTable';
import { Label } from '@/components/ui/Label';
import { useGetMaterialDisposeReceipt, useGetMaterialReceipt } from '@/hooks/useGetMaterial';
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
import DisposeDialog from './DisposeDialog';
import { convertDateWithTime } from '@/helpers/convertDateWithTime';
import { MaterialExportReceipt } from '@/types/ExportReceipt';

type Props = {
  id: string;
  receiptId: string | null;
};

const ReceiptTable: React.FC<Props> = ({ id, receiptId }) => {
  const [selectedReceiptId, setSelectedReceiptId] = useState<string | null>(null);
  const [isOpened, setIsOpened] = useState(false);
  const [isDisposeDialogOpen, setIsDisposeDialogOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<MaterialReceipt | null>(null);
  const [render, setRender] = useState(0);

  const getStatusBadgeVariant = (status: string) => {
    const statusObj = ReceiptStatusLabel.find((s) => s.value === status);
    return statusObj ? statusObj.variant : 'default';
  };

  const openDialog = (id: string) => {
    setSelectedReceiptId(id);
    setIsOpened(true);
  };

  const openDisposeDialog = (receipt: MaterialReceipt) => {
    setSelectedReceipt(receipt);
    setIsDisposeDialogOpen(true);
  };
  const reRender = () => {
    setRender((render) => render + 1);
  };

  const handleDisposeSuccess = () => {
    // Refresh the table data
    reRender();
  };

  useEffect(() => {
    if (receiptId) {
      openDialog(receiptId);
    }
  }, [receiptId, render]);

  const materialImportReceiptColumn: CustomColumnDef<any>[] = [
    {
      header: 'Receipt code',
      accessorKey: 'code',
      enableColumnFilter: false,
      cell: ({ row }) => {
        const code = row.original.materialExportReceipt.code
        return (
          <div>
            <div>{code}</div>
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
            <div>{row.original?.materialReceipt?.materialPackage?.code}</div>
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
            <div>{row.original?.materialReceipt?.materialPackage?.name}</div>
          </div>
        );
      }
    },
    {
      header: 'Export Date',
      accessorKey: 'createdAt',
      enableColumnFilter: false,
      enableSorting: false,
      cell: ({ row }) => {
        const dateString = row.original?.createdAt;
        if (!dateString) {
          return <div>N/A</div>;
        }
        
        return (
          <div>
            <div>{convertDateWithTime(dateString)}</div>
          </div>
        );
      }
    },
    {
      header: 'Export Quantity',
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
      header: 'Type',
      accessorKey: 'type',
      enableColumnFilter: false,
      cell: ({ row }) => (
        // <div
        //   className={badgeVariants({ variant: getStatusBadgeVariant(row.original?.status ?? '') })}>
        //   {capitalizeFirstLetter(row.original?.status ?? 'N/A')}
        // </div>
        <div className={badgeVariants({variant: "destructive"})}>
          {row.original?.materialExportReceipt?.type}
        </div>
      ),
      // filterOptions: ReceiptStatusLabel.map((status) => ({
      //   label: status.label,
      //   value: status.value
      // }))
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const receipt = row.original;

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
              <DropdownMenuItem onClick={() => openDialog(receipt.id)}>View</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      }
    }
  ];

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
  } = useGetMaterialDisposeReceipt(id, {
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

  if (!id) {
    return (
      <div>
        <h1>No Material Receipt</h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
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

      {selectedReceipt && (
        <DisposeDialog
          receipt={selectedReceipt}
          isOpen={isDisposeDialogOpen}
          setIsOpen={setIsDisposeDialogOpen}
          onDisposeSuccess={handleDisposeSuccess}
        />
      )}
    </div>
  );
};

export default ReceiptTable;
