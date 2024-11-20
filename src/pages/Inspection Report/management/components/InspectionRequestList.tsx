import { useDebounce } from '@/hooks/useDebouce';
import { useGetAllInspectionRequest } from '@/hooks/useGetAllInspectionRequests';
import { ColumnFiltersState, PaginationState, SortingState } from '@tanstack/react-table';
import { useState } from 'react';
import TanStackBasicTable from '@/components/common/CompositeTable';
import { convertDate } from '@/helpers/convertDate';
import { Badge } from '@/components/ui/Badge';
import {
  InspectionRequestStatus,
  InspectionRequestStatusLabels
} from '@/enums/inspectionRequestStatus';
import { InspectionRequest } from '@/types/InspectionRequest';
import { CustomColumnDef } from '@/types/CompositeTable';
import { Link } from 'react-router-dom';
import { InspectionRequestType, InspectionRequestTypeLabels } from '@/enums/inspectionRequestType';

const InspectionReportList = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const debouncedColumnFilters: ColumnFiltersState = useDebounce(columnFilters, 1000);
  const debouncedSorting: SortingState = useDebounce(sorting, 1000);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10
  });

  const { isFetching, inspectionRequestList, pageMeta } = useGetAllInspectionRequest({
    sorting: debouncedSorting,
    columnFilters: debouncedColumnFilters,
    pagination
  });

  const paginatedTableData =
    inspectionRequestList && pageMeta
      ? {
          data: inspectionRequestList,
          limit: pageMeta.limit,
          page: pageMeta.page,
          total: pageMeta.total,
          totalFiltered: pageMeta.totalPages
        }
      : undefined;

  const inspectionRequestColumns: CustomColumnDef<InspectionRequest>[] = [
    {
      header: 'Request Code',
      accessorKey: 'code',
      cell: ({ row }) => (
        <Link to={`/report/${row.original.id}`} className="font-semibold text-primary underline">
          {row.original.code}
        </Link>
      ),
      enableColumnFilter: false
    },
    {
      header: 'Import Request Code',
      accessorKey: 'importRequest.code',
      cell: ({ row }) =>
        row.original.importRequest?.code ? (
          <Badge className="bg-slate-500">{row.original.importRequest.code}</Badge>
        ) : (
          <div className="text-slate-400">N/A</div>
        ),
      enableColumnFilter: false
    },
    {
      header: 'Type',
      accessorKey: 'type',
      enableColumnFilter: true,
      filterOptions: Object.keys(InspectionRequestType).map((key) => ({
        label:
          InspectionRequestTypeLabels[
            InspectionRequestType[key as keyof typeof InspectionRequestType]
          ],
        value: InspectionRequestType[key as keyof typeof InspectionRequestType]
      })),
      cell: ({ row }) => (
        <div className="font-semibold mr-2">
          {InspectionRequestTypeLabels[row.original.type as InspectionRequestType] || 'N/A'}
        </div>
      )
    },
    {
      header: 'Status',
      accessorKey: 'status',
      enableColumnFilter: true,
      filterOptions: Object.keys(InspectionRequestStatus).map((key) => ({
        label:
          InspectionRequestStatusLabels[
            InspectionRequestStatus[key as keyof typeof InspectionRequestStatus]
          ],
        value: InspectionRequestStatus[key as keyof typeof InspectionRequestStatus]
      })),
      cell: ({ row }) => {
        const status = row.original.status as InspectionRequestStatus;
        const statusLabel = InspectionRequestStatusLabels[status];
        let colorVariant;
        switch (status) {
          case InspectionRequestStatus.INSPECTING:
            colorVariant = 'bg-blue-500 text-white';
            break;
          case InspectionRequestStatus.INSPECTED:
            colorVariant = 'bg-green-500 text-white';
            break;
          case InspectionRequestStatus.CANCELLED:
            colorVariant = 'bg-red-500 text-white';
            break;
          default:
            colorVariant = 'bg-gray-200 text-black';
        }
        return <Badge className={`mr-6 ${colorVariant}`}>{statusLabel}</Badge>;
      }
    },
    {
      header: 'Inspection Report Code',
      accessorKey: 'inspectionReport.code',
      cell: ({ row }) =>
        row.original.inspectionReport?.code ? (
          <Badge className="bg-green-500 text-white ml-[10%]">
            {row.original.inspectionReport.code}
          </Badge>
        ) : (
          <div className="ml-[30%]">
            <span className="text-slate-500 text-center text-xl font-semibold">-</span>
          </div>
        ),
      enableColumnFilter: false
    },

    {
      header: 'Requested At',
      accessorKey: 'createdAt',
      cell: ({ getValue }) => {
        const isoDate = getValue<string>();
        return <div className="ml-3">{convertDate(isoDate)}</div>;
      },
      enableColumnFilter: false
    }
  ];

  return (
    <div className="flex flex-col px-3 pt-3 pb-4 w-auto bg-white rounded-xl shadow-sm border">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-primaryLight">Inspection Request Lists</h1>
      </div>
      <div className="overflow-auto h-[700px] mt-4">
        <TanStackBasicTable
          isTableDataLoading={isFetching}
          paginatedTableData={paginatedTableData}
          columns={inspectionRequestColumns}
          pagination={pagination}
          setPagination={setPagination}
          sorting={sorting}
          setSorting={setSorting}
          columnFilters={columnFilters}
          setColumnFilters={setColumnFilters}
          totalPages={paginatedTableData?.totalFiltered}
          searchColumnId="code"
        />
      </div>
    </div>
  );
};

export default InspectionReportList;
