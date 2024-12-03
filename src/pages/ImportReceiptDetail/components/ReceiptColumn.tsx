import { badgeVariants } from "@/components/ui/Badge";
import { Button } from "@/components/ui/button";
import capitalizeFirstLetter from "@/helpers/capitalizeFirstLetter";
import { convertTitleToTitleCase } from "@/helpers/convertTitleToCaseTitle";
import { CustomColumnDef } from "@/types/CompositeTable";
import { MaterialReceipt } from "@/types/ImportReceipt";
import { MaterialExportReceipt,  ReceiptStatusLabel } from "@/types/MaterialTypes";
import { ProductReceipt } from "@/types/ProductType";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";

export const getStatusBadgeVariant = (status: string) => {
  const statusObj = ReceiptStatusLabel.find((s) => s.value === status);
  return statusObj ? statusObj.variant : 'default'; // Default variant if no match is found
};
export const materialImportReceiptColumn: CustomColumnDef<MaterialReceipt>[] = [
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
        <div className='flex'>
          <div className="text-left">{row.original.quantityByPack} {convertTitleToTitleCase  (row.original?.materialPackage?.packUnit)}</div>
        </div>
      );
    }
  },
  // {
  //   header: 'Remain Quantity',
  //   accessorKey: '',
  //   enableColumnFilter: false,
  //   cell: ({ row }) => {
  //     return (
  //       <div className='flex'>
  //         <div className=''>{row.original?.remainQuantityByPack}</div>
  //       </div>
  //     );
  //   }
  // },
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
    filterOptions: ReceiptStatusLabel.map((status) => ({ label: status.label, value: status.value }))
  },
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
        <div className='flex'>
          <div className=''>{row.original?.quantityByPack}</div>
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
        <div className='flex'>
          <div className=''>{row.original?.remainQuantityByPack}</div>
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
    filterOptions: ReceiptStatusLabel.map((status) => ({ label: status.label, value: status.value }))
  },

];

export const productImportReceiptColumn: CustomColumnDef<ProductReceipt>[] = [
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
        <div className='flex'>
          <div className="text-left">{row.original.quantityByUom} {convertTitleToTitleCase  (row.original?.productSize?.productVariant?.product?.name)}</div>
        </div>
      );
    }
  },
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
    filterOptions: ReceiptStatusLabel.map((status) => ({ label: status.label, value: status.value }))
  },
];