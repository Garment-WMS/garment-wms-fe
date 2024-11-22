import DataTableColumnHeader from '@/components/common/EditableTable/DataTableColumnHeader';

import { CustomColumnDef } from '@/types/CompositeTable';
import { z } from 'zod';

export const getMaterialColumns = ({}: any): CustomColumnDef<any>[] => [
  {
    accessorKey: 'code',
    header: 'Code',
    cell: ({ row }) => <div className="text-center">{row.original.materialPackage.code}</div>
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader className="text-center" column={column} title="Name" />
    ),
    cell: ({ row }) => <div className="text-center">{row.original.materialPackage.name}</div>
  },
  {
    accessorKey: 'packUnit',
    header: ({ column }) => (
      <DataTableColumnHeader className="text-center" column={column} title="Packing Unit" />
    ),
    cell: ({ row }) => <div className="text-center">{row.original.materialPackage.packUnit}</div>
  },
  {
    accessorKey: 'size',
    header: ({ column }) => (
      <DataTableColumnHeader className="text-center" column={column} title="Size" />
    ),
    cell: ({ row }) => (
      <div className="text-center">{`${row.original.materialPackage.packedLength}x${row.original.materialPackage.packedWidth}x${row.original.materialPackage.packedHeight}`}</div>
    )
  },
  {
    accessorKey: 'uomPerPack',
    header: ({ column }) => (
      <DataTableColumnHeader className="text-center" column={column} title="UOM Per Pack" />
    ),
    cell: ({ row }) => <div className="text-center">{row.original.materialPackage.uomPerPack}</div>
  },
  {
    accessorKey: 'uom',
    header: ({ column }) => (
      <DataTableColumnHeader className="text-center" column={column} title="Unit of packing" />
    ),
    cell: ({ row }) => <div className="text-center">123</div>
  },
  {
    accessorKey: 'plannedQuantity',
    header: ({ column }) => (
      <DataTableColumnHeader className="text-center" column={column} title="Planned Quantity" />
    ),
    cell: ({ row }) => <div className="text-center">{row.original.plannedQuantity}</div>,

    validation: z.number().nonnegative('Planned Quantity must be equal or  greater than 0')
  },
  {
    accessorKey: 'actualQuantity',
    header: ({ column }) => (
      <DataTableColumnHeader className="text-center" column={column} title="Actual Quantity" />
    ),
    cell: ({ row }) => <div className="text-center">{row.original.actualQuantity}</div>,
    isEditable: true,
    validation: z.number().positive('Actual Quantity have to be at least 1')
  },

  {
    id: 'actions',
    cell: ({ row }) => <div></div>,
    size: 50
  }
];
