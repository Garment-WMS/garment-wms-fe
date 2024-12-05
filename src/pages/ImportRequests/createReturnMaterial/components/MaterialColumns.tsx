import DataTableColumnHeader from '@/components/common/EditableTable/DataTableColumnHeader';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { CustomColumnDef } from '@/types/CompositeTable';
import { AvatarImage } from '@radix-ui/react-avatar';
import { z } from 'zod';

export const getMaterialColumns = ({}: any): CustomColumnDef<any>[] => [
  {
    accessorKey: 'code',
    header: 'Code',
    cell: ({ row }) => <div className="text-center">{row.original.materialVariant.code}</div>
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader className="text-center" column={column} title="Name" />
    ),
    cell: ({ row }) => <div className="text-center">{row.original.materialVariant.name}</div>
  },
  {
    accessorKey: 'image',
    header: ({ column }) => (
      <DataTableColumnHeader className="text-center" column={column} title="Material image" />
    ),
    cell: ({ row }) => (
      <div className="flex justify-center">
        <img src={row.original.materialVariant.image} className="w-10 h-10 rounded" />
      </div>
    )
  },
  {
    accessorKey: 'Material type',
    header: ({ column }) => (
      <DataTableColumnHeader className="text-center" column={column} title="Material Type" />
    ),
    cell: ({ row }) => (
      <div className="text-center">{row.original.materialVariant.material.code}</div>
    )
  },
  {
    accessorKey: 'uom',
    header: ({ column }) => (
      <DataTableColumnHeader className="text-center" column={column} title="UOM" />
    ),
    cell: ({ row }) => (
      <div className="text-center">{row.original.materialVariant.material.materialUom.name}</div>
    )
  },
  {
    accessorKey: 'plannedQuantity',
    header: ({ column }) => (
      <DataTableColumnHeader className="text-center" column={column} title="Planned Quantity" />
    ),
    cell: ({ row }) => (
      <div className="text-center">
        {row.original.plannedQuantity}{' '}
        {row.original.materialVariant.material.materialUom.uomCharacter}
      </div>
    ),
    validation: z.number().nonnegative('Planned Quantity must be equal or greater than 0')
  },

  {
    id: 'actions',
    cell: ({ row }) => <div></div>,
    size: 50
  }
];
