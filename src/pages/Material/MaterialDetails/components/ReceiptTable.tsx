import { DataTable } from '@/components/ui/DataTable';
import React, { useEffect, useState } from 'react';
import { ReceiptChart } from './ReceiptChart';
import {
  MaterialExportReceiptResponse,
  MaterialImportReceiptResponse
} from '@/types/MaterialTypes';
import { ColumnFiltersState, PaginationState, SortingState } from '@tanstack/react-table';
import { useDebounce } from '@/hooks/useDebouce';
import { Button } from '@/components/ui/button';
import importIcon from '@/assets/images/import-goods-delivery-svgrepo-com.svg';
import exportIcon from '@/assets/images/export-shipment-trade-svgrepo-com.svg';
import TanStackBasicTable from '@/components/common/CompositeTable';
import { useGetMaterialImportReceipt } from '@/hooks/useGetMaterialImportReceipt';
import { useGetMaterialExportReceipt } from '@/hooks/useGetMaterialExportReceipt';
import { materialExportReceiptColumn, materialImportReceiptColumn } from './ReceiptColumn';

type Props = {
  id: string;
};
type displayState = 'import' | 'export';
const ReceiptTable: React.FC<Props> = ({ id }) => {
  const [state, setState] = useState<displayState>('import');
  const [importPagination, setImportPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5
  });
  const [exportPagination, setExportPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5
  });

  const handleDisplayChange = (state: displayState) => {
    console.log(state);
    setState(state);
  };
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

  const {
    pageMeta: importPageMeta,
    importReceiptData,
    isLoading: isImportLoading
  } = useGetMaterialImportReceipt(id, {
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

  const {
    pageMeta: exportPageMeta,
    exportReceiptData,
    isLoading: isExportLoading
  } = useGetMaterialExportReceipt(id, {
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
          <Button onClick={() => handleDisplayChange('import')} variant="outline" size="icon">
            <img className="h-7 w-7" src={importIcon} />
          </Button>
          <Button onClick={() => handleDisplayChange('export')} variant="outline" size="icon">
            <img className="h-7 w-7" src={exportIcon} />
          </Button>
        </div>
        {state === 'import' ? (
          <TanStackBasicTable
            isTableDataLoading={isImportLoading}
            paginatedTableData={importData}
            columns={materialImportReceiptColumn}
            pagination={importPagination}
            sorting={importDebouncedSorting}
            setSorting={setImportSorting}
            setPagination={setImportPagination}
            columnFilters={importDebouncedColumnFilters}
            setColumnFilters={setImportColumnFilters}
          />
        ) : (
          <TanStackBasicTable
            isTableDataLoading={isExportLoading}
            paginatedTableData={exportData}
            columns={materialExportReceiptColumn}
            pagination={exportPagination}
            sorting={exportDebouncedSorting}
            setSorting={setExportSorting}
            setPagination={setExportPagination}
            columnFilters={exportDebouncedColumnFilters}
            setColumnFilters={setExportColumnFilters}
          />
        )}
      </div>
      <ReceiptChart />
    </div>
  );
};

export default ReceiptTable;
