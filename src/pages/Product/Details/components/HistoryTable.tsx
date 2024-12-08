import TanStackBasicTable from '@/components/common/CompositeTable';
import { Label } from '@/components/ui/Label';
import { formatDateTimeToDDMMYYYYHHMM } from '@/helpers/convertDate';
import { convertDateWithTime } from '@/helpers/convertDateWithTime';
import { convertTitleToTitleCase } from '@/helpers/convertTitleToCaseTitle';
import { useDebounce } from '@/hooks/useDebouce';
import { useGetMaterialHistory } from '@/hooks/useGetMaterialHistory';
import { useGetProductHistory } from '@/hooks/useGetProductHistory';
import { CustomColumnDef } from '@/types/CompositeTable';
import { AdjustmentReceiptForHistory, ExportReceiptForHistory, ImportReceiptForHistory, ReceiptBase } from '@/types/MaterialTypes';
import { ProductReceiptBase } from '@/types/ProductType';
import { ArrowDownIcon, ArrowUpIcon } from '@radix-ui/react-icons';
import { ColumnFiltersState, PaginationState, SortingState } from '@tanstack/react-table';
import { Minus } from 'lucide-react';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';

type Props = {
    id: string;

  };

const HistoryTable: React.FC<Props> = ({ id}) => {
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

  const { historyReceiptList, pageMeta, isLoading, isFetching } = useGetProductHistory(id,{
    sorting: debouncedSorting,
    columnFilters: debouncedColumnFilters,
    pagination
  })

  const dataWithPage = historyReceiptList && pageMeta && {
    data: historyReceiptList,
    limit: pageMeta?.limit || 0,
    page: pageMeta?.page || 0,
    total: pageMeta?.total || 0,
    totalFiltered: pageMeta?.total || 0
  }

  const materialImportReceiptColumn: CustomColumnDef<ProductReceiptBase>[] = [
    {
      header: 'Code',
      accessorKey: 'code',
      enableColumnFilter: false,
      cell: ({ row }) => {
        const navigate = useNavigate();
        let url = ''
        const receipt = row.original;
        if (receipt.type === 'IMPORT_RECEIPT' && 'importReceiptId' in receipt){
            url = `/import-receipt/${receipt.importReceiptId}`
        }else if (receipt.type === 'EXPORT_RECEIPT'  && 'exportReceiptId' in receipt){
            url = `/export-receipt/${receipt.exportReceiptId}`
        }else if(receipt.type === 'RECEIPT_ADJUSTMENT' && 'inventoryReportId' in receipt){
            url = `/stocktaking/${receipt.inventoryReportId}`
        }
        const handleClick = (e: React.MouseEvent) => {
            e.preventDefault(); // Prevent default navigation
            window.open(url, '_blank'); // Open the link in a new tab
          };
        return (
          <div onClick={handleClick} className='text-bluePrimary underline cursor-pointer'>
            <div>{row.original?.code}</div>
          </div>
        );
      }
    },
    {
      header: 'Type',
      accessorKey: 'type',
      enableColumnFilter: false,
      cell: ({ row }) => {
        return (
          <div>
            <div>{convertTitleToTitleCase(row.original?.type)}</div>
          </div>
        );
      }
    },
    {
      header: 'Product Type',
      accessorKey: 'isDefect',
      enableColumnFilter: false,
      cell: ({ row }) => {
        const isDefect = row.original.isDefect;
        console.log(isDefect)
        let result 
        if (isDefect === null || isDefect === undefined) {
          return <div>N/A</div>;
        }else {
          isDefect ? result = 'Disqualified' : result = 'Qualified'
        }
        return (
          <div>
            <div className={!isDefect? `text-green-500` : `text-red-500`}>{result}</div>
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
      header: 'Create date',
      accessorKey: 'createdAt',
      enableColumnFilter: false,
      enableSorting: false,
      cell: ({ row }) => {
        return (
          <div className="flex">
            <div className="">{formatDateTimeToDDMMYYYYHHMM(row.original?.createdAt)}</div>
          </div>
        );
      }
    },
    {
        header: 'Quantity',
        accessorKey: 'quantityByPack',
        enableColumnFilter: false,
        enableSorting: false,
        cell: ({ row }) => {
          const quantity = row.original?.quantityByPack ?? 0; // Default to 0 if undefined
      
          // Determine styles and icons based on quantity
          const isPositive = quantity > 0;
          const isNegative = quantity < 0;
      
          const icon = isPositive ? (
            <ArrowUpIcon className="h-4 w-4 text-green-500" />
          ) : isNegative ? (
            <ArrowDownIcon className="h-4 w-4 text-red-500" />
          ) : <Minus className="h-4 w-4"/>;
      
          const textColor = isPositive
            ? 'text-green-500'
            : isNegative
            ? 'text-red-500'
            : 'text-gray-700'; // Default neutral color
      
          const bgColor = isPositive
            ? 'bg-green-100'
            : isNegative
            ? 'bg-red-100'
            : 'bg-gray-100'; // Background color for balance indicator
      
          return (
            <div className={`flex items-center space-x-2 p-2 rounded `}>
              {icon}
              <div className={`font-semibold ${textColor}`}>
                {quantity === 0 ? '0' : Math.abs(quantity)}
              </div>
            </div>
          );
        },
      },
    // {
    //   header: 'Status',
    //   accessorKey: 'status',
    //   enableColumnFilter: true,
    //   cell: ({ row }) => (
    //     <div
    //       className={badgeVariants({ variant: getStatusBadgeVariant(row.original?.status ?? '') })}>
    //       {capitalizeFirstLetter(row.original?.status ?? 'N/A')}
    //     </div>
    //   ),
    //   filterOptions: ReceiptStatusLabel.map((status) => ({
    //     label: status.label,
    //     value: status.value
    //   }))
    // },
  ];
  return (
    <div className=" flex flex-col gap-4 ">
      <div className="h-full">
        <div className="">
          <TanStackBasicTable
            isTableDataLoading={isLoading}
            paginatedTableData={dataWithPage}
            columns={materialImportReceiptColumn}
            pagination={pagination}
            sorting={sorting}
            setSorting={setSorting}
            setPagination={setPagination}
            columnFilters={columnFilters}
            setColumnFilters={setColumnFilters}
            searchColumnId="code"
            searchPlaceholder="Search by code"
          />
        </div>
      </div>


    </div>
  )
}

export default HistoryTable