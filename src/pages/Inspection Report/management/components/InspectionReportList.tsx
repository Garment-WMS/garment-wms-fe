import { useDebounce } from '@/hooks/useDebouce';
import { useGetAllInspectionReport } from '@/hooks/useGetAllInspectionReports';
import { ColumnFiltersState, PaginationState, SortingState } from '@tanstack/react-table';
import { useState } from 'react';

const InspectionReportList = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const debouncedColumnFilters: ColumnFiltersState = useDebounce(columnFilters, 1000);
  const debouncedSorting: SortingState = useDebounce(sorting, 1000);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10
  });
  const { isFetching, inspectionReportList, pageMeta } = useGetAllInspectionReport({
    sorting: debouncedSorting,
    columnFilters: debouncedColumnFilters,
    pagination
  });
  return <div></div>;
};

export default InspectionReportList;
