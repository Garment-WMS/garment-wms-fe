import { DataTable } from '@/components/ui/DataTable';
import { CustomColumnDef } from '@/types/CompositeTable';
import { useSelector } from 'react-redux';
import exportRequestSelector from '../slice/selector';
import { MaterialExportRequest } from '@/types/exportRequest';
import { UOM } from '@/types/MaterialTypes';
import { convertTitleToTitleCase } from '@/helpers/convertTitleToCaseTitle';
import { formatNumber } from '@/helpers/formatNumber';

interface ColumnType {
  id: string;
  name: string; // Fallback to 'N/A' if undefined
  code: string;
  packUnit: string;
  materialName: any;
  uom:UOM;
  uomPerPack: any;
  quantityByUOM: any;
  materialCode: any;
  materialType: any; // Fallback for nested materialType
}

const ExportRequestDetail = () => {
  const exportRequest: MaterialExportRequest = useSelector(exportRequestSelector.exportRequest);
  let details = exportRequest?.materialExportRequestDetail ?? [];
  let formattedDetails: any[] = [];
  if (details) {
    formattedDetails = details.map((detail) => {
      const materialPackage = detail;
      return {
        id: materialPackage?.id ?? 'N/A',
        code: materialPackage?.materialVariant.code ?? 'N/A',
        packUnit: materialPackage?.materialVariant?.material?.materialUom.name ?? 'N/A',
        materialName: materialPackage?.materialVariant.name ?? 'N/A', // Fallback for nested material
        uomPerPack: materialPackage?.materialVariant.material.materialUom.name ?? 0, // Default to 0 if undefined
        uom: detail.materialVariant?.material?.materialUom ?? "N/A",
        quantityByUOM: detail.quantityByUom ?? 0, // Default to 0 if undefined
        materialCode: materialPackage?.materialVariant.material?.code ?? 'N/A', // Fallback for nested material
        materialType: materialPackage?.materialVariant.material.name ?? 'N/A' // Fallback for nested materialType
      };
    });
  }

  const DetailsColumn: CustomColumnDef<ColumnType>[] = [
    {
      header: 'Material Code',
      accessorKey: 'code',
      enableColumnFilter: false,
      cell: ({ row }) => {
        return <div className="text-left">{row.original.code}</div>;
      }
    },
    {
      header: 'Variant Name',
      accessorKey: 'name',
      enableColumnFilter: false,
      cell: ({ row }) => {
        return <div className="text-left">{row.original.materialName}</div>;
      }
    },
    {
      header: 'Material Name',
      accessorKey: 'materialName',
      cell: ({ row }) => {
        return <div className="text-left">{row.original.materialType}</div>;
      }
    },
    {
      header: 'Unit of measure',
      accessorKey: 'uomPerPack',
      enableColumnFilter: false
    },
    {
      header: 'Quantity By UOM',
      accessorKey: 'quantityByUOM',
      enableColumnFilter: false,
      cell: ({ row }) => {
        return <div className="text-left">{row.original.quantityByUOM} {convertTitleToTitleCase(row.original?.packUnit)}</div>;
      }
    },

  ];
  return (
    <div className="flex flex-col gap-4">
      <div className="font-primary text-xl font-bold my-2">Export Request Details</div>
      <div className="pb-4">
        <div className="mb-4 w-auto bg-white rounded-xl shadow-sm border">
          <DataTable columns={DetailsColumn} data={formattedDetails} />
        </div>
      </div>
    </div>
  );
};

export default ExportRequestDetail;
