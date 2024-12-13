import { CustomColumnDef } from '@/types/CompositeTable';
import { InventoryReport } from '@/types/InventoryReport';

export const materialImportReceiptColumn: CustomColumnDef<InventoryReport>[] = [
  {
    header: 'Receipt code',
    accessorKey: 'code',
    enableColumnFilter: false,
    cell: ({ row }) => {
      return (
        <div>
          <div>{row.original.code}</div>
        </div>
      );
    }
  },
  {
    header: 'Balenaced By',
    accessorKey: 'warehouseManager.account.name',
    enableColumnFilter: false,
    cell: ({ row }) => {
      return (
        <div>
          <div>{row.original.warehouseManager.account.firstName}</div>
        </div>
      );
    }
  },
  {
    header: 'Reported by',
    accessorKey: 'warehouseStaff.account.name',
    enableColumnFilter: false,
    cell: ({ row }) => {
      return (
        <div>
          <div>{row.original.warehouseStaff.account.firstName}</div>
        </div>
      );
    }
  },
  {
    header: 'Started Date',
    accessorKey: 'from',
    enableColumnFilter: false,
    cell: ({ row }) => {
      const dateString = row.original.from;
      if (!dateString) {
        return <div>N/A</div>;
      }
      const date = new Date(dateString);
      const formattedDate = date.toLocaleDateString('en-GB', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
      return (
        <div>
          <div>{formattedDate}</div>
        </div>
      );
    }
  },
  {
    header: 'End Date',
    accessorKey: 'to',
    enableColumnFilter: false,
    cell: ({ row }) => {
      const dateString = row.original.to;
      if (!dateString) {
        return <div>N/A</div>;
      }
      const date = new Date(dateString);
      const formattedDate = date.toLocaleDateString('en-GB', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
      return (
        <div>
          <div>{formattedDate}</div>
        </div>
      );
    }
  }
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
  // {
  //   header: 'Import Quantity',
  //   accessorKey: 'quantityByPack',
  //   enableColumnFilter: false,
  //   cell: ({ row }) => {
  //     return (
  //       <div className='flex'>
  //         <div className=''>{row.original.quantityByPack}</div>
  //       </div>
  //     );
  //   }
  // },
  // {
  //   header: 'Remain Quantity',
  //   accessorKey: '',
  //   enableColumnFilter: false,
  //   cell: ({ row }) => {
  //     return (
  //       <div className='flex'>
  //         <div className=''>{row.original.remainQuantityByPack}</div>
  //       </div>
  //     );
  //   }
  // },
  // {
  //   header: 'Status',
  //   accessorKey: 'status',
  //   enableColumnFilter: true,
  //   cell: ({ row }) => (
  //     <div
  //       className={badgeVariants({ variant: getStatusBadgeVariant(row.original.status ?? '') })}>
  //       {capitalizeFirstLetter(row.original.status ?? 'N/A')}
  //     </div>
  //   ),
  //   filterOptions: ReceiptStatusLabel.map((status) => ({ label: status.label, value: status.value }))
  // },
];

const StocktakingColumn: CustomColumnDef<InventoryReport>[] = [
  {
    header: 'Code',
    accessorKey: 'code',
    enableColumnFilter: false
  },
  {
    header: 'Balanced By',
    accessorKey: 'warehouseManager.account.name',
    enableColumnFilter: false
  },
  {
    header: 'Reported By',
    accessorKey: 'warehouseStaff.account.name',
    enableColumnFilter: false
  },
  {
    header: 'From',
    accessorKey: 'from',
    enableColumnFilter: false
  },
  {
    header: 'Total Positive',
    accessorKey: 'totalPositive',
    enableColumnFilter: false
  },
  {
    header: 'Total Negative',
    accessorKey: 'totalNegative',
    enableColumnFilter: false
  },
  {
    header: 'Note',
    accessorKey: 'note',
    enableColumnFilter: false
  },
  {
    header: 'Status',
    accessorKey: 'status',
    enableColumnFilter: false
  }
];
