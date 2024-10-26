import { Button } from '@/components/ui/button';
import { MaterialPackage, MaterialVariant } from '@/types/MaterialTypes';
import { CaretSortIcon } from '@radix-ui/react-icons';
import { ColumnDef } from '@tanstack/react-table';

export const DetailsColumn: ColumnDef<MaterialPackage>[] = [
  {
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Variant Code
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    accessorKey: 'code',
    cell: ({ row }) => <div className="text-left ml-4">{row.original.code}</div> // Center content
  },
  {
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Variant Name
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    accessorKey: 'name',
    enableSorting: true,
    cell: ({ row }) => <div className="text-left ml-4">{row.original.name}</div> // Center content
  },
  {
    header: 'Pack Unit',
    accessorKey: 'packUnit',
    enableColumnFilter: true,
    cell: ({ row }) => <div className="text-left">{row.original.packUnit}</div> // Center content
  },
  {
    header: 'Quantity per Pack',
    accessorKey: 'uomPerPack',
    enableColumnFilter: false,
    cell: ({ row }) => <div className="text-left">{row.original.uomPerPack}</div> // Center content
  },
  {
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Quantity
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    accessorKey: 'inventoryStock.quantityByPack',
    cell: ({ row }) => {
      const quantity = row.original.inventoryStock ? row.original.inventoryStock.quantityByPack : 0;
      return <div className="text-left ml-4">{quantity}</div>; // Center content
    }
  }
];
