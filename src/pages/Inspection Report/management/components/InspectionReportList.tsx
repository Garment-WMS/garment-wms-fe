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
  console.log(inspectionReportList);
  return (
    <div className="flex flex-col px-3 pt-3 pb-4 w-auto bg-white rounded-xl shadow-sm border">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-primaryLight">Inspection Report Lists</h1>
      </div>
    </div>
  );
};

export default InspectionReportList;
