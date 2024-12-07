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
  name: string;
  code: string;
  packUnit: string;
  materialName: any;
  uom: UOM;
  uomPerPack: any;
  quantityByUOM: any;
  materialCode: any;
  materialType: any;
}

interface ReceiptDetailColumnType {
  id: string;
  materialCode: string;
  materialName: string;
  packageName: string;
  quantityByPack: number;
  packUnit: string;
  uomPerPack: number;
  uomCharacter: string;
}

const ExportRequestDetail = () => {
  const exportRequest: MaterialExportRequest = useSelector(exportRequestSelector.exportRequest);
  let details = exportRequest?.materialExportRequestDetail ?? [];
  let formattedDetails: ColumnType[] = [];

  if (details) {
    formattedDetails = details.map((detail) => ({
      id: detail.id ?? 'N/A',
      code: detail.materialVariant?.code ?? 'N/A',
      packUnit: detail.materialVariant?.material?.materialUom?.name ?? 'N/A',
      materialName: detail.materialVariant?.name ?? 'N/A',
      uomPerPack: detail.materialVariant?.material?.materialUom?.name ?? 'N/A',
      uom: detail.materialVariant?.material?.materialUom ?? { uomCharacter: 'N/A' },
      quantityByUOM: detail.quantityByUom ?? 0,
      materialCode: detail.materialVariant?.material?.code ?? 'N/A',
      materialType: detail.materialVariant?.material?.name ?? 'N/A'
    }));
  }

  const DetailsColumn: CustomColumnDef<ColumnType>[] = [
    {
      header: 'Material Code',
      accessorKey: 'code',
      enableColumnFilter: false
    },
    {
      header: 'Variant Name',
      accessorKey: 'materialName',
      enableColumnFilter: false
    },
    {
      header: 'Material Name',
      accessorKey: 'materialType'
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
      cell: ({ row }) => (
        <div className="text-left">
          {formatNumber(row.original.quantityByUOM)}{' '}
          {convertTitleToTitleCase(row.original.uom.uomCharacter)}
        </div>
      )
    }
  ];

  const receiptDetails = exportRequest?.materialExportReceipt?.materialExportReceiptDetail ?? [];
  const formattedReceiptDetails: ReceiptDetailColumnType[] = receiptDetails.map((detail) => ({
    id: detail.id,
    materialCode: detail.materialReceipt.materialPackage.materialVariant.code,
    materialName: detail.materialReceipt.materialPackage.materialVariant.name,
    packageName: detail.materialReceipt.materialPackage.name,
    quantityByPack: detail.quantityByPack,
    packUnit: detail.materialReceipt.materialPackage.packUnit,
    uomPerPack: detail.materialReceipt.materialPackage.uomPerPack,
    uomCharacter:
      detail.materialReceipt.materialPackage.materialVariant.material.materialUom.uomCharacter
  }));

  const ReceiptDetailsColumn: CustomColumnDef<ReceiptDetailColumnType>[] = [
    {
      header: 'Material Code',
      accessorKey: 'materialCode',
      enableColumnFilter: false
    },
    {
      header: 'Material Name',
      accessorKey: 'materialName',
      enableColumnFilter: false
    },
    {
      header: 'Package Name',
      accessorKey: 'packageName',
      enableColumnFilter: false
    },
    {
      header: 'Quantity',
      accessorKey: 'quantityByPack',
      enableColumnFilter: false,
      cell: ({ row }) => (
        <div className="text-left">
          {formatNumber(row.original.quantityByPack)}{' '}
          {convertTitleToTitleCase(row.original.packUnit)}
        </div>
      )
    },
    {
      header: 'UOM per Pack',
      accessorKey: 'uomPerPack',
      enableColumnFilter: false,
      cell: ({ row }) => (
        <div className="text-left">
          {formatNumber(row.original.uomPerPack)} {row.original.uomCharacter}/
          {row.original.packUnit}
        </div>
      )
    }
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="font-primary text-xl font-bold my-2">Export Request Details</div>
      <div className="pb-4">
        <div className="mb-4 w-auto bg-white rounded-xl shadow-sm border">
          <DataTable columns={DetailsColumn} data={formattedDetails} />
        </div>
      </div>

      {formattedReceiptDetails.length > 0 && (
        <div>
          <div className="font-primary text-xl font-bold my-2">Material Export Receipt Details</div>
          <div className="mb-4 w-auto bg-white rounded-xl shadow-sm border">
            <DataTable columns={ReceiptDetailsColumn} data={formattedReceiptDetails} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportRequestDetail;
