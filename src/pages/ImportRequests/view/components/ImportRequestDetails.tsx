import { DataTable } from '@/components/ui/DataTable';
import { CustomColumnDef } from '@/types/CompositeTable';
import { ImportRequest } from '@/types/ImportRequestType';
import { useSelector } from 'react-redux';
import importRequestSelector from '../../slice/selector';

type Props = {};

interface ColumnType {
  name?: string;
  code?: string;
  packUnit?: string;
  uomPerPack?: number;
  quantityByPack?: number;
  materialName: string;
  materialCode?: string;
  materialType?: string;
}

const ImportRequestDetails = (props: Props) => {
  const importRequest: ImportRequest = useSelector(importRequestSelector.importRequest);
  let details = importRequest?.importRequestDetail ?? [];
  let formattedDetails: ColumnType[] = [];
  if (details) {
    formattedDetails = details.map((detail) => {
      const materialPackage = detail.materialPackage;

      return {
        name: materialPackage?.name ?? 'N/A', // Fallback to 'N/A' if undefined
        code: materialPackage?.code ?? 'N/A',
        packUnit: materialPackage?.packUnit ?? 'N/A',
        materialName: materialPackage?.material?.name ?? 'N/A', // Fallback for nested material
        uomPerPack: materialPackage?.uomPerPack ?? 0, // Default to 0 if undefined
        quantityByPack: detail.quantityByPack ?? 0, // Default to 0 if undefined
        materialCode: materialPackage?.material?.code ?? 'N/A', // Fallback for nested material
        materialType: materialPackage?.material?.materialType?.name ?? 'N/A' // Fallback for nested materialType
      };
    });
  }

  const DetailsColumn: CustomColumnDef<ColumnType>[] = [
    {
      header: 'Variant code',
      accessorKey: 'code',
      enableColumnFilter: false
    },
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
      header: 'Variant Name',
      accessorKey: 'name',
      enableColumnFilter: false
    },
    {
      header: 'Material Type',
      accessorKey: 'materialType',
      enableColumnFilter: false
    },
    {
      header: 'Unit of measure',
      accessorKey: 'packUnit',
      enableColumnFilter: false
    },
    {
      header: 'Quantity per pack',
      accessorKey: 'uomPerPack',
      enableColumnFilter: false
    },
    {
      header: 'Quantity By Pack',
      accessorKey: 'quantityByPack',
      enableColumnFilter: false
    }
  ];
  return (
    <div className="flex flex-col gap-4">
      <div className="font-primary text-xl font-bold my-2">Import Request Details</div>
      <div className="pb-4">
        <div className="mb-4 w-auto bg-white rounded-xl shadow-sm border">
          <DataTable columns={DetailsColumn} data={formattedDetails} />
        </div>
      </div>
    </div>
  );
};

export default ImportRequestDetails;
