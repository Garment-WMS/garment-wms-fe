import { Button } from "@/components/ui/button";
import { CustomColumnDef } from "@/types/CompositeTable";
import { MaterialExportReceipt, MaterialImportReceipt, MaterialReceipt } from "@/types/MaterialTypes";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";

export const materialImportReceiptColumn: CustomColumnDef<MaterialImportReceipt>[] = [
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
    header: 'Material Package code',
    accessorKey: 'materialPackage.code',
    enableColumnFilter: false,
    cell: ({ row }) => {
      return (
        <div>
          <div>{row.original.materialPackage.code}</div>
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
          <div>{row.original.materialPackage.name}</div>
        </div>
      );
    }
  },
  {
    header: 'Import Date',
    accessorKey: 'importDate',
    enableColumnFilter: false,
    cell: ({ row }) => {
      return (
        <div>
          <div>{row.original.importDate}</div>
        </div>
      );
    }
  },
  {
    header: 'Expired Date',
    accessorKey: 'expireDate',
    enableColumnFilter: false,
    cell: ({ row }) => {
      return (
        <div>
          <div>{row.original.expireDate}</div>
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
          <div className=''>{row.original.quantityByPack}</div>
        </div>
      );
    }
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
          <div>{row.original.code}</div>
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
          <div>{row.original.materialPackage.code}</div>
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
          <div>{row.original.materialPackage.name}</div>
        </div>
      );
    }
  },
  {
    header: 'Import Date',
    accessorKey: 'importDate',
    enableColumnFilter: false,
    cell: ({ row }) => {
      return (
        <div>
          <div>{row.original.importDate}</div>
        </div>
      );
    }
  },
  {
    header: 'Expired Date',
    accessorKey: 'expireDate',
    enableColumnFilter: false,
    cell: ({ row }) => {
      return (
        <div>
          <div>{row.original.expireDate}</div>
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
          <div className=''>{row.original.quantityByPack}</div>
        </div>
      );
    }
  },

];