import TanStackBasicTable from '@/components/common/CompositeTable';
import { CustomColumnDef, UseGetTableResponseType } from '@/types/CompositeTable';
import { PODeliveryDetail } from '@/types/PurchaseOrder';
import { ColumnFiltersState, PaginationState, SortingState } from '@tanstack/react-table';
import React, { useState } from 'react';

interface MaterialTableProps {
  poDeliveryDetail: PODeliveryDetail[];
}

const MaterialTable: React.FC<MaterialTableProps> = ({ poDeliveryDetail }) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20
  });
  const poDeliveryDetailList: UseGetTableResponseType<PODeliveryDetail> = {
    limit: 10,
    page: 1,
    total: 20,
    totalFiltered: 10,
    data: poDeliveryDetail
  };

  const purchaseOrderDeliveryDetailsColumns: CustomColumnDef<PODeliveryDetail>[] = [
    {
      header: 'Material Code',
      accessorKey: 'materialPackage.code',
      cell: ({ getValue }) => <div className="pl-2 font-semibold">{getValue<string>()}</div>,
      enableColumnFilter: true
    },
    {
      header: 'Material Name',
      accessorKey: 'materialPackage.name',
      enableColumnFilter: false
    },
    {
      header: 'Material Type',
      accessorKey: 'materialPackage.materialVariant.material.name',
      cell: ({ getValue }) => <div className="ml-1">{getValue<string>()}</div>,
      enableColumnFilter: false
    },
    {
      header: 'Width',
      accessorKey: 'materialPackage.packedWidth',
      cell: ({ row }) => <div className="ml-1">{row.original.materialPackage.packedWidth} m</div>,
      enableColumnFilter: false
    },
    {
      header: 'Length',
      accessorKey: 'materialPackage.packedLength',
      cell: ({ row }) => <div className="ml-1">{row.original.materialPackage.packedLength} m</div>,
      enableColumnFilter: false
    },
    {
      header: 'Weight',
      accessorKey: 'materialPackage.packedWeight',
      cell: ({ getValue }) => <div className="ml-1">{getValue<number>()} kg</div>,
      enableColumnFilter: false
    },
    {
      header: 'Quantity',
      accessorKey: 'quantityByPack',
      cell: ({ row }) => {
        const uomPerPack = row.original.quantityByPack;
        const packUnit = row.original.materialPackage.packUnit;
        const pluralizedPackUnit = uomPerPack > 1 ? `${packUnit}s` : packUnit;
        return (
          <div className="ml-1">
            <span>{uomPerPack}</span>{' '}
            <span className="lowercase text-slate-800">{pluralizedPackUnit}</span>
          </div>
        );
      },
      enableColumnFilter: false
    },
    {
      header: 'Actual Import Quantity',
      accessorKey: 'actualImports',
      cell: ({ row }) => {
        const uomPerPack = row.original.actualImportQuantity;
        const packUnit = row.original.materialPackage.packUnit;
        const pluralizedPackUnit = uomPerPack > 1 ? `${packUnit}s` : packUnit;

        return (
          <div className="ml-1">
            {uomPerPack === 0 ? (
              <span className="text-slate-500 ml-9">Not yet</span>
            ) : (
              <div className="ml-9">
                <span>{uomPerPack}</span>{' '}
                <span className="lowercase text-slate-800">{pluralizedPackUnit}</span>
              </div>
            )}
          </div>
        );
      },
      enableColumnFilter: false
    },
    {
      header: 'Total Amount',
      accessorKey: 'totalAmount',
      cell: ({ getValue }) => {
        const value = getValue<number>();

        return (
          <div className="font-semibold">
            {value
              ? `${value.toLocaleString('en-GB', {
                  year: 'numeric',
                  month: 'numeric',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false // Use 24-hour format
                })} VND`
              : 'Not available'}
          </div>
        );
      },
      enableColumnFilter: false
    }
  ];

  return (
    <div>
      <TanStackBasicTable
        isTableDataLoading={false}
        paginatedTableData={poDeliveryDetailList}
        columns={purchaseOrderDeliveryDetailsColumns}
        pagination={pagination}
        setPagination={setPagination}
        sorting={sorting}
        setSorting={setSorting}
        columnFilters={columnFilters}
        setColumnFilters={setColumnFilters}
        showToolbar={false}
      />
    </div>
  );
};

export default MaterialTable;
