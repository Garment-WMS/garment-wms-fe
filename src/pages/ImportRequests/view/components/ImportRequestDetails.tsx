import { DataTable } from '@/components/ui/DataTable';
import { CustomColumnDef } from '@/types/CompositeTable';
import { ImportRequest } from '@/types/ImportRequestType';
import { useSelector } from 'react-redux';
import importRequestSelector from '../../slice/selector';
import { MaterialPackage, UOM } from '@/types/MaterialTypes';
import { convertTitleToTitleCase } from '@/helpers/convertTitleToCaseTitle';
import { formatNumber } from '@/helpers/formatNumber';

interface ColumnTypeForPostInspection {
  id: string;
  name: string;
  code: string;
  packUnit: string;
  quantityByPack: number;
  approvedQuantityByPack: number;
  defectQuantityByPack: number;
}

type Props = {};

interface ColumnType {
  id: string;
  name: string; // Fallback to 'N/A' if undefined
  code: string;
  packUnit: string;
  materialName: any;
  uomPerPack: any;
  uom: UOM;
  quantityByPack: any;
  materialCode: any;
  materialType: any; // Fallback for nested materialType
  image: any;
}
interface ColumnTypeForProduct {
  id: string;
  name: string; // Fallback to 'N/A' if undefined
  code: string;
  size: any;
  productName: any;
  type: string; // Add this line
  quantityByPack: any;
  image: any;
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
            id: materialPackage.id ?? 'N/A',
            name: materialPackage.name ?? 'N/A',
            code: materialPackage.code ?? 'N/A',
            packUnit: materialPackage.packUnit ?? 'N/A',
            materialName: materialPackage.materialVariant?.material?.name ?? 'N/A',
            uomPerPack: materialPackage.uomPerPack ?? 0,
            uom: materialPackage.materialVariant?.material?.materialUom ?? 'N/A',
            quantityByPack: detail.quantityByPack ?? 0,
            materialCode: materialPackage.materialVariant?.material?.code ?? 'N/A',
            materialType: materialPackage.materialVariant?.material?.name ?? 'N/A',
            image: materialPackage.materialVariant?.image ?? null
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
            id: productSize.id ?? 'N/A',
            name: productSize.name ?? 'N/A',
            code: productSize.code ?? 'N/A',
            size: productSize.size ?? 'N/A',
            productName: productSize.productVariant?.name ?? 'N/A',
            type: productSize.productVariant.product.name ?? 'N/A',
            quantityByPack: detail.quantityByPack ?? 0,
            image: productSize.productVariant?.image ?? ''
          };
        }
        return null; // Return null if productSize is not defined
      })
      .filter((item): item is ColumnTypeForProduct => item !== null);
  }
  const DetailsColumnForPostInspection: CustomColumnDef<ColumnTypeForPostInspection>[] = [
    {
      header: 'Item Code',
      accessorKey: 'code',
      enableColumnFilter: false
    },
    {
      header: 'Item Name',
      accessorKey: 'name',
      enableColumnFilter: false
    },
    {
      header: 'Pack Unit',
      accessorKey: 'packUnit',
      enableColumnFilter: false
    },
    {
      header: 'Quantity',
      accessorKey: 'quantityByPack',
      enableColumnFilter: false
    },
    {
      header: 'Approved Quantity',
      accessorKey: 'approvedQuantityByPack',
      enableColumnFilter: false
    },
    {
      header: 'Defect Quantity',
      accessorKey: 'defectQuantityByPack',
      enableColumnFilter: false
    }
  ];

  const DetailsColumn: CustomColumnDef<ColumnType>[] = [
    {
      header: 'Material',
      accessorKey: 'name',
      enableColumnFilter: false,
      cell: ({ row }) => {
        const imageUrl = row.original.image;
        const variantName = row.original.name;
        return (
          <div className="flex items-center gap-4">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="Material"
                className="w-12 h-12 object-cover rounded border border-gray-300"
              />
            ) : (
              <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-sm font-medium">
                No Image
              </div>
            )}
            <span className="text-left font-medium text-gray-800">{variantName}</span>
          </div>
        );
      }
    },
    {
      header: 'Material Code',
      accessorKey: 'code',
      enableColumnFilter: false,
      cell: ({ row }) => <div className="text-left">{row.original.code}</div>
    },
    {
      header: 'Material Type',
      accessorKey: 'materialType',
      enableColumnFilter: false,
      cell: ({ row }) => (
        <div className=" ml-5 text-gray-600 font-semibold">{row.original.materialType}</div>
      )
    },
    {
      header: 'Quantity By Pack',
      accessorKey: 'quantityByPack',
      enableColumnFilter: false,
      cell: ({ row }) => (
        <div className=" ml-5">
          {row.original.quantityByPack} {convertTitleToTitleCase(row.original?.packUnit)}
        </div>
      )
    },
    {
      header: 'Quantity by UOM',
      accessorKey: 'uomPerPack',
      enableColumnFilter: false,
      cell: ({ row }) => (
        <div className=" ml-5">
          {formatNumber(row.original.uomPerPack * row.original.quantityByPack)}{' '}
          {row.original?.uom.uomCharacter}
        </div>
      )
    }
  ];

  const DetailsColumnForProduct: CustomColumnDef<ColumnTypeForProduct>[] = [
    {
      header: 'Product',
      accessorKey: 'productName',
      enableColumnFilter: false,
      cell: ({ row }) => {
        const imageUrl = row.original.image;
        const productName = row.original.productName;
        return (
          <div className="flex items-center gap-4">
            {imageUrl ? (
              <img src={imageUrl} alt="Product" className="w-12 h-12 object-cover rounded" />
            ) : (
              <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                No Image
              </div>
            )}
            <span className="text-left font-medium">{productName}</span>
          </div>
        );
      }
    },
    {
      header: 'Product Code',
      accessorKey: 'code',
      enableColumnFilter: false,
      cell: ({ row }) => <div className="text-left">{row.original.code}</div>
    },
    {
      header: 'Product Type',
      accessorKey: 'type',
      enableColumnFilter: false,
      cell: ({ row }) => <div className="text-left ml-3">{row.original.type}</div>
    },
    {
      header: 'Size',
      accessorKey: 'size',
      enableColumnFilter: false,
      cell: ({ row }) => (
        <div className="text-left ml-3 font-semibold text-primaryLight">{row.original.size}</div>
      )
    },
    {
      header: 'Quantity By Pack',
      accessorKey: 'quantityByPack',
      enableColumnFilter: false,
      cell: ({ row }) => <div className="text-center text-lg">{row.original.quantityByPack}</div>
    }
  ];

  let formattedDetailsPostInspection: ColumnTypeForPostInspection[] = [];
  if (importRequest?.inspectionRequest && importRequest.inspectionRequest.length > 0) {
    const inspectionReport = importRequest.inspectionRequest[0].inspectionReport;
    if (inspectionReport && inspectionReport.inspectionReportDetail) {
      formattedDetailsPostInspection = inspectionReport.inspectionReportDetail.map((detail) => {
        const item = detail.materialPackage || detail.productSize;
        return {
          id: detail.id,
          name: item?.name ?? 'N/A',
          code: item?.code ?? 'N/A',
          packUnit:
            detail.materialPackage?.packUnit ??
            item?.productVariant?.product?.productUom?.uomCharacter ??
            'N/A',
          quantityByPack: detail.quantityByPack ?? 0,
          approvedQuantityByPack: detail.approvedQuantityByPack,
          defectQuantityByPack: detail.defectQuantityByPack
        };
      });
    }
  }
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
        {formattedDetailsPostInspection.length > 0 && (
          <div className="mb-4 w-auto bg-white rounded-xl shadow-sm border">
            <div className="font-primary text-lg font-semibold p-4">Post-Inspection Details</div>
            <DataTable
              columns={DetailsColumnForPostInspection}
              data={formattedDetailsPostInspection}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ImportRequestDetails;
