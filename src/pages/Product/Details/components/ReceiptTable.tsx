import { DataTable } from '@/components/ui/DataTable';
import React, { useState } from 'react';

import { ColumnFiltersState, PaginationState, SortingState } from '@tanstack/react-table';
import { useDebounce } from '@/hooks/useDebouce';
import { Button } from '@/components/ui/button';
import importIcon from '@/assets/images/import-goods-delivery-svgrepo-com.svg';
import exportIcon from '@/assets/images/export-shipment-trade-svgrepo-com.svg';
import TanStackBasicTable from '@/components/common/CompositeTable';
import { useGetMaterialImportReceipt } from '@/hooks/useGetMaterialImportReceipt';
import { useGetMaterialExportReceipt } from '@/hooks/useGetMaterialExportReceipt';
import { Label } from '@/components/ui/Label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CiInboxIn, CiInboxOut } from "react-icons/ci";
import { useGetProductImportReceipt } from '@/hooks/useGetProductImportReceipt';
import { useGetProductExportReceipt } from '@/hooks/useGetProductExportReceipt';
import { productExportReceiptColumn, productImportReceiptColumn } from './ReceiptColumn';
import { ReceiptChart } from './ReceiptChart';
type Props = {
  id: string;
};
type displayState = 'import' | 'export';
const ReceiptTable: React.FC<Props> = ({ id }) => {
  const [state, setState] = useState<displayState>('import');

  const handleDisplayChange = (state: displayState) => {
    setState(state);
  };
  if (!id) {
    return (
      <div>
        <h1>No Product Receipt </h1>
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
    importReceiptData,
    isLoading: isImportLoading
  } = useGetProductImportReceipt(id, {
    sorting: importDebouncedSorting,
    columnFilters: importDebouncedColumnFilters,
    pagination: importPagination
  });

  const importData = importReceiptData &&
    importPageMeta && {
      data: importReceiptData,
      limit: importPageMeta?.limit || 0,
      page: importPageMeta?.page || 0,
      total: importPageMeta?.total || 0,
      totalFiltered: importPageMeta?.total || 0
    };

  const [exportColumnFilters, setExportColumnFilters] = useState<ColumnFiltersState>([]);

  const [exportSorting, setExportSorting] = useState<SortingState>([]);

  const exportDebouncedColumnFilters: ColumnFiltersState = useDebounce(exportColumnFilters, 1000);

  const exportDebouncedSorting: SortingState = useDebounce(exportSorting, 1000);

  const [exportPagination, setExportPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5
  });
  const {
    pageMeta: exportPageMeta,
    exportReceiptData,
    isLoading: isExportLoading
  } = useGetProductExportReceipt(id, {
    sorting: exportDebouncedSorting,
    columnFilters: exportDebouncedColumnFilters,
    pagination: exportPagination
  });
  const exportData = exportReceiptData &&
    exportPageMeta && {
      data: exportReceiptData,
      limit: exportPageMeta?.limit || 0,
      page: exportPageMeta?.page || 0,
      total: exportPageMeta?.total || 0,
      totalFiltered: exportPageMeta?.total || 0
    };

  return (
    <div className=" flex flex-col gap-4 ">
      <div className="h-full">
        <div className="flex mb-4 px-8 justify-end">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={() => handleDisplayChange('import')} variant="outline" size="icon">
                <CiInboxIn size={28}/>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Import</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {/* <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={() => handleDisplayChange('export')} variant="outline" size="icon">
                <CiInboxOut size={28}/>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Export</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider> */}
        </div>
        {state === 'import' ? (
          <div className="">
            <Label>Import Receipt</Label>
            <TanStackBasicTable
              isTableDataLoading={isImportLoading}
              paginatedTableData={importData}
              columns={productImportReceiptColumn}
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
        ) : (
          <div className="">
            <Label>Export Receipt</Label>

            <TanStackBasicTable
              isTableDataLoading={isExportLoading}
              paginatedTableData={exportData}
              columns={productExportReceiptColumn}
              pagination={exportPagination}
              sorting={exportSorting}
              setSorting={setExportSorting}
              setPagination={setExportPagination}
              columnFilters={exportColumnFilters}
              setColumnFilters={setExportColumnFilters}
              searchColumnId="code"
              searchPlaceholder="Search by code"
            />
          </div>
        )}
      </div>
      <ReceiptChart />
    </div>
  );
};

export default ReceiptTable;
