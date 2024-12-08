import { Badge, badgeVariants } from '@/components/ui/Badge';
import capitalizeFirstLetter from '@/helpers/capitalizeFirstLetter';
import { convertDateWithTime } from '@/helpers/convertDateWithTime';
import { convertTitleToTitleCase } from '@/helpers/convertTitleToCaseTitle';
import { CustomColumnDef } from '@/types/CompositeTable';
import { MaterialReceipt } from '@/types/ImportReceipt';
import { MaterialExportReceipt, ReceiptStatusLabel } from '@/types/MaterialTypes';
import { ProductReceipt } from '@/types/ProductType';

export const getStatusBadgeVariant = (status: string) => {
  const statusObj = ReceiptStatusLabel.find((s) => s.value === status);
  return statusObj ? statusObj.variant : 'default'; // Default variant if no match is found
};
export const materialImportReceiptColumn: CustomColumnDef<MaterialReceipt>[] = [
  {
    header: 'Material',
    accessorKey: 'materialPackage.materialVariant.name',
    enableColumnFilter: false,
    cell: ({ row }) => {
      const materialVariant = row.original?.materialPackage?.materialVariant;
      const materialName = materialVariant?.name || 'N/A';
      const materialImage = materialVariant?.image || '/placeholder.svg';
      const packageName = row.original?.materialPackage?.name || 'N/A';

      return (
        <div className="flex items-center space-x-4">
          <img
            src={materialImage}
            alt={materialName}
            width={48}
            height={48}
            className="rounded-md object-cover"
          />
          <div>
            <div className="font-medium">{materialName}</div>
            <div className="text-sm text-muted-foreground">{packageName}</div>
          </div>
        </div>
      );
    }
  },
  {
    header: 'Receipt code',
    accessorKey: 'code',
    enableColumnFilter: false,
    cell: ({ row }) => {
      return (
        <div>
          <div>{row.original?.code}</div>
        </div>
      );
    }
  },
  {
    header: 'Material Package code',
    accessorKey: 'materialPackage.code',
    enableColumnFilter: false,
    cell: ({ row }) => {
      return (
        <div>
          <div>{row.original?.materialPackage?.code}</div>
        </div>
      );
    }
  },
  {
    header: 'Import Date',
    accessorKey: 'importDate',
    enableColumnFilter: false,
    cell: ({ row }) => {
      const dateString = row.original?.importDate;
      if (!dateString) {
        return <div>N/A</div>;
      }
      return (
        <div>
          <div>{convertDateWithTime(dateString)}</div>
        </div>
      );
    }
  },
  {
    header: 'Import Quantity',
    accessorKey: 'quantityByPack',
    enableColumnFilter: false,
    cell: ({ row }) => {
      return (
        <div className="flex">
          <div className="text-lg text-slate-800">
            {row.original.quantityByPack}{' '}
            {convertTitleToTitleCase(row.original?.materialPackage?.packUnit)}
          </div>
        </div>
      );
    }
  }
];

export const materialExportReceiptColumn: CustomColumnDef<MaterialExportReceipt>[] = [
  {
    header: 'Receipt code',
    accessorKey: 'code',
    enableColumnFilter: false,
    cell: ({ row }) => {
      return (
        <div>
          <div>{row.original?.code}</div>
        </div>
      );
    }
  },
  {
    header: 'Material Package code',
    accessorKey: 'materialPackage.code',
    enableColumnFilter: false,
    cell: ({ row }) => {
      return (
        <div>
          <div>{row.original?.materialPackage?.code}</div>
        </div>
      );
    }
  },
  {
    header: 'Material Package name',
    accessorKey: 'materialPackage.name',
    enableColumnFilter: false,
    cell: ({ row }) => {
      return (
        <div>
          <div>{row.original?.materialPackage?.name}</div>
        </div>
      );
    }
  },
  {
    header: 'Import Date',
    accessorKey: 'importDate',
    enableColumnFilter: false,
    cell: ({ row }) => {
      const dateString = row.original?.importDate;
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
      const dateString = row.original?.expireDate;
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
    accessorKey: 'quantityByPack',
    enableColumnFilter: false,
    cell: ({ row }) => {
      return (
        <div className="flex">
          <div className="">{row.original?.quantityByPack}</div>
        </div>
      );
    }
  },
  {
    header: 'Remain Quantity',
    accessorKey: '',
    enableColumnFilter: false,
    cell: ({ row }) => {
      return (
        <div className="flex">
          <div className="">{row.original?.remainQuantityByPack}</div>
        </div>
      );
    }
  },
  {
    header: 'Status',
    accessorKey: 'status',
    enableColumnFilter: true,
    cell: ({ row }) => (
      <div
        className={badgeVariants({ variant: getStatusBadgeVariant(row.original?.status ?? '') })}>
        {capitalizeFirstLetter(row.original?.status ?? 'N/A')}
      </div>
    ),
    filterOptions: ReceiptStatusLabel.map((status) => ({
      label: status.label,
      value: status.value
    }))
  }
];

export const productImportReceiptColumn: CustomColumnDef<ProductReceipt>[] = [
  {
    header: 'Product',
    accessorKey: 'productSize.productVariant.name',
    enableColumnFilter: false,
    cell: ({ row }) => {
      const productVariant = row.original?.productSize?.productVariant;
      const productName = productVariant?.name || 'N/A';
      const productImage = productVariant?.image || '/placeholder.svg';
      const productSize = row.original?.productSize?.size || 'N/A';

      return (
        <div className="flex items-center space-x-4">
          <img
            src={productImage}
            alt={productName}
            width={48}
            height={48}
            className="rounded-md object-cover"
          />
          <div>
            <div className="font-medium">{productName}</div>
            <div className="text-sm text-muted-foreground">Size: {productSize}</div>
          </div>
        </div>
      );
    }
  },
  {
    header: 'Receipt code',
    accessorKey: 'code',
    enableColumnFilter: false,
    cell: ({ row }) => {
      return (
        <div>
          <div>{row.original?.code}</div>
        </div>
      );
    }
  },
  {
    header: 'Product size code',
    accessorKey: 'productSize.code',
    enableColumnFilter: false,
    cell: ({ row }) => {
      return (
        <div>
          <div>{row.original?.productSize?.code}</div>
        </div>
      );
    }
  },
  {
    header: 'Product size',
    accessorKey: 'productSize.name',
    enableColumnFilter: false,
    cell: ({ row }) => {
      return (
        <div>
          <div>{row.original?.productSize?.name}</div>
        </div>
      );
    }
  },
  {
    header: 'Import Date',
    accessorKey: 'importDate',
    enableColumnFilter: false,
    cell: ({ row }) => {
      const dateString = row.original?.importDate;
      if (!dateString) {
        return <div>N/A</div>;
      }
      const date = new Date(dateString);
      const formattedDate = date.toLocaleDateString('en-US', {
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
    header: 'Import Quantity',
    accessorKey: 'quantityByUom',
    enableColumnFilter: false,
    cell: ({ row }) => {
      return (
        <div className="flex">
          <div className="text-left text-lg ml-6 text-slate-800 ">{row.original.quantityByUom}</div>
        </div>
      );
    }
  },
  {
    header: 'Status',
    accessorKey: 'isDefect',
    enableColumnFilter: true,
    cell: ({ row }) => {
      const isDefect = row.original?.isDefect;
      return (
        <Badge variant={isDefect ? 'destructive' : 'success'}>{isDefect ? 'Failed' : 'Pass'}</Badge>
      );
    },
    filterOptions: [
      { label: 'Defective', value: 'true' },
      { label: 'Approved', value: 'false' }
    ]
  }
  // {
  //   header: 'Remain Quantity',
  //   accessorKey: '',
  //   enableColumnFilter: false,
  //   cell: ({ row }) => {
  //     return (
  //       <div className='flex'>
  //         <div className=''>{row.original?.remainQuantityByUom}</div>
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
  //       className={badgeVariants({ variant: getStatusBadgeVariant(row.original?.status ?? '') })}>
  //       {capitalizeFirstLetter(row.original?.status ?? 'N/A')}
  //     </div>
  //   ),
  //   filterOptions: ReceiptStatusLabel.map((status) => ({ label: status.label, value: status.value }))
  // },
];
