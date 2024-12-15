import { badgeVariants } from '@/components/ui/Badge';
import { Button } from '@/components/ui/button';
import capitalizeFirstLetter from '@/helpers/capitalizeFirstLetter';
import { CustomColumnDef } from '@/types/CompositeTable';
import {
  MaterialExportReceipt,
  MaterialImportReceipt,
  MaterialReceipt,
  ReceiptStatusLabel
} from '@/types/MaterialTypes';
import { ProductExportReceipt, ProductImportReceipt } from '@/types/ProductType';
import { CaretSortIcon } from '@radix-ui/react-icons';
import { ColumnDef } from '@tanstack/react-table';

export const getStatusBadgeVariant = (status: string) => {
  const statusObj = ReceiptStatusLabel.find((s) => s.value === status);
  return statusObj ? statusObj.variant : 'default'; // Default variant if no match is found
};
export const productImportReceiptColumn: CustomColumnDef<ProductImportReceipt>[] = [
  {
    header: 'Receipt code',
    accessorKey: 'code',
    enableColumnFilter: false,
    cell: ({ row }) => {
      return (
        <div>
          <div>{row.original.code || 'N/A'}</div>
        </div>
      );
    }
  },
  {
    header: 'Product Size code',
    accessorKey: 'productSize.code',
    enableColumnFilter: false,
    cell: ({ row }) => {
      return (
        <div>
          <div>{row.original.productSize.code || 'N/A'}</div>
        </div>
      );
    }
  },
  {
    header: 'Product Size name',
    accessorKey: 'productSize.name',
    enableColumnFilter: false,
    cell: ({ row }) => {
      return (
        <div>
          <div>{row.original.productSize.name}</div>
        </div>
      );
    }
  },
  {
    header: 'Import Date',
    accessorKey: 'importDate',
    enableColumnFilter: false,
    cell: ({ row }) => {
      const dateString = row.original.importDate;
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
    header: 'Expired Date',
    accessorKey: 'expireDate',
    enableColumnFilter: false,
    cell: ({ row }) => {
      const dateString = row.original.expireDate;
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
    header: 'Import Quantity',
    accessorKey: 'quantityByUom',
    enableColumnFilter: false,
    cell: ({ row }) => {
      return (
        <div className="flex">
          <div className="">{row.original.quantityByUom}</div>
        </div>
      );
    }
  },
  {
    header: 'Remain Quantity',
    accessorKey: 'remainQuantityByUom',
    enableColumnFilter: false,
    cell: ({ row }) => {
      return (
        <div className="flex">
          <div className="">{row.original.remainQuantityByUom}</div>
        </div>
      );
    }
  },
  {
    header: 'Status',
    accessorKey: 'status',
    enableColumnFilter: true,
    cell: ({ row }) => (
      <div className={badgeVariants({ variant: getStatusBadgeVariant(row.original.status ?? '') })}>
        {capitalizeFirstLetter(row.original.status ?? 'N/A')}
      </div>
    ),
    filterOptions: ReceiptStatusLabel.map((status) => ({
      label: status.label,
      value: status.value
    }))
  }
];

export const productExportReceiptColumn: CustomColumnDef<ProductExportReceipt>[] = [
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
    header: 'Product Size code',
    accessorKey: 'productSize.code',
    enableColumnFilter: false,
    cell: ({ row }) => {
      return (
        <div>
          <div>{row.original.productSize.code}</div>
        </div>
      );
    }
  },
  {
    header: 'Product Size name',
    accessorKey: 'productSize.name',
    enableColumnFilter: false,
    cell: ({ row }) => {
      return (
        <div>
          <div>{row.original.productSize.name}</div>
        </div>
      );
    }
  },
  {
    header: 'Import Date',
    accessorKey: 'importDate',
    enableColumnFilter: false,
    cell: ({ row }) => {
      const dateString = row.original.importDate;
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
    header: 'Expired Date',
    accessorKey: 'expireDate',
    enableColumnFilter: false,
    cell: ({ row }) => {
      const dateString = row.original.expireDate;
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
    header: 'Import Quantity',
    accessorKey: 'quantityByUom',
    enableColumnFilter: false,
    cell: ({ row }) => {
      return (
        <div className="flex">
          <div className="">{row.original.quantityByUom}</div>
        </div>
      );
    }
  },
  {
    header: 'Remain Quantity',
    accessorKey: 'remainQuantityByUom',
    enableColumnFilter: false,
    cell: ({ row }) => {
      return (
        <div className="flex">
          <div className="">{row.original.remainQuantityByUom}</div>
        </div>
      );
    }
  },
  {
    header: 'Status',
    accessorKey: 'status',
    enableColumnFilter: true,
    cell: ({ row }) => (
      <div className={badgeVariants({ variant: getStatusBadgeVariant(row.original.status ?? '') })}>
        {capitalizeFirstLetter(row.original.status ?? 'N/A')}
      </div>
    ),
    filterOptions: ReceiptStatusLabel.map((status) => ({
      label: status.label,
      value: status.value
    }))
  }
];
