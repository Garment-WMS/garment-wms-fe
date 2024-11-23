import { DataTable } from '@/components/ui/DataTable';
import { CustomColumnDef } from '@/types/CompositeTable';
import { ImportRequest } from '@/types/ImportRequestType';
import { useSelector } from 'react-redux';
import importRequestSelector from '../../slice/selector';

type Props = {};

interface ColumnType {
  id: string;
  name: string; // Fallback to 'N/A' if undefined
  code: string;
  packUnit: string;
  materialName: any;
  uomPerPack: any;
  quantityByPack: any;
  materialCode: any;
  materialType: any; // Fallback for nested materialType
}
interface ColumnTypeForProduct {
  id: string;
  name: string; // Fallback to 'N/A' if undefined
  code: string;
  size: any;
  productName: any;
  type: string; // Add this line
  quantityByPack: any;
}
const ImportRequestDetails = (props: Props) => {
  const importRequest: ImportRequest = useSelector(importRequestSelector.importRequest);
  let details = importRequest?.importRequestDetail ?? [];
  let formattedDetailsMaterial: ColumnType[] = [];
  let formattedDetailsProduct: ColumnTypeForProduct[] = [];
  if (details) {
    // Format material details
    formattedDetailsMaterial = details
      .map((detail) => {
        const materialPackage = detail.materialPackage;
        if (materialPackage) {
          return {
            id: materialPackage.id ?? "N/A",
            name: materialPackage.name ?? "N/A",
            code: materialPackage.code ?? "N/A",
            packUnit: materialPackage.packUnit ?? "N/A",
            materialName: materialPackage.materialVariant?.material?.name ?? "N/A",
            uomPerPack: materialPackage.uomPerPack ?? 0,
            quantityByPack: detail.quantityByPack ?? 0,
            materialCode: materialPackage.materialVariant?.material?.code ?? "N/A",
            materialType: materialPackage.materialVariant?.material?.name ?? "N/A",
          };
        }
        return null; // Return null if materialPackage is not defined
      })
      .filter((item): item is ColumnType => item !== null);
    
  // Format product details
  formattedDetailsProduct = details
  .map((detail) => {
    const productSize = detail.productSize;
    if (productSize) {
      return {
        id: productSize.id ?? "N/A",
        name: productSize.name ?? "N/A",
        code: productSize.code ?? "N/A",
        size: productSize.size ?? "N/A",
        productName: productSize.productVariant?.name ?? "N/A",
        type: productSize.productVariant.product.name ?? "N/A",
        quantityByPack: detail.quantityByPack ?? 0,
      };
    }
    return null; // Return null if productSize is not defined
  })
  .filter((item): item is ColumnTypeForProduct => item !== null);
  };
  const DetailsColumn: CustomColumnDef<ColumnType>[] = [
    {
      header: 'Material Code',
      accessorKey: 'code',
      enableColumnFilter: false
    },
    {
      header: 'Material Name',
      accessorKey: 'materialName',
      enableColumnFilter: false,
      cell: ({ row }) => {
        return <div className="text-left">{row.original.materialName}</div>;
      }
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
  const DetailsColumnForProduct: CustomColumnDef<ColumnTypeForProduct>[] = [
    {
      header: 'Product Code',
      accessorKey: 'code',
      enableColumnFilter: false
    },
    {
      header: 'Product Variant Name',
      accessorKey: 'productName',
      enableColumnFilter: false,
      cell: ({ row }) => {
        return <div className="text-left">{row.original.productName}</div>;
      }
    },
    {
      header: 'Size Name',
      accessorKey: 'name',
      enableColumnFilter: false
    },
   
    {
      header: 'Size',
      accessorKey: 'size',
      enableColumnFilter: false
    },
    {
      header: 'Product Type',
      accessorKey: 'type',
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
        {formattedDetailsMaterial.length > 0 && (
          <div className="mb-4 w-auto bg-white rounded-xl shadow-sm border">
          <DataTable columns={DetailsColumn} data={formattedDetailsMaterial} />
        </div>
        )}
        {formattedDetailsProduct.length > 0 && (
          <div className="mb-4 w-auto bg-white rounded-xl shadow-sm border">
          <DataTable columns={DetailsColumnForProduct} data={formattedDetailsProduct} />
        </div>
        )}
        
      </div>
    </div>
  );
};

export default ImportRequestDetails;
