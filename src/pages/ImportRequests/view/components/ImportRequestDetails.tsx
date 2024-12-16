import { DataTable } from '@/components/ui/DataTable';
import { CustomColumnDef } from '@/types/CompositeTable';
import { ImportRequest } from '@/types/ImportRequestType';
import { useSelector } from 'react-redux';
import importRequestSelector from '../../slice/selector';
import { MaterialPackage, UOM } from '@/types/MaterialTypes';
import { convertTitleToTitleCase } from '@/helpers/convertTitleToCaseTitle';
import { formatNumber } from '@/helpers/formatNumber';
import { pluralize } from '@/helpers/pluralize';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
      .filter((item): item is ColumnType => item !== null)
      .filter((item): item => item.quantityByPack > 0);

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
      header: 'Item',
      accessorKey: 'name',
      enableColumnFilter: false,
      cell: ({ row }) => {
        const imageUrl = row.original.image; // Image for both material and product
        const itemName = row.original.name;
        return (
          <div className="flex items-center gap-4" style={{ maxWidth: '200px' }}>
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="Item"
                className="w-12 h-12 object-cover rounded border border-gray-300"
                style={{ flexShrink: 0 }}
              />
            ) : (
              <div
                className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-sm font-medium"
                style={{ flexShrink: 0 }}>
                No Image
              </div>
            )}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span
                    className="text-left font-medium text-gray-800 truncate cursor-pointer"
                    style={{
                      flexGrow: 1,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                    {itemName}
                  </span>
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-gray-800 text-white p-2 rounded shadow">
                  {itemName}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        );
      }
    },
    {
      header: 'Item Code',
      accessorKey: 'code',
      enableColumnFilter: false,
      cell: ({ row }) => <div className="text-left">{row.original.code}</div>
    },
    {
      header: 'Quantity',
      accessorKey: 'quantityByPack',
      enableColumnFilter: false,
      cell: ({ row }) => (
        <div className=" font-medium text-primaryLight lowercase ml-2">
          {row.original.quantityByPack}{' '}
          {pluralize(row.original.packUnit, row.original.quantityByPack)}
        </div>
      )
    },
    {
      header: 'Approved Quantity',
      accessorKey: 'approvedQuantityByPack',
      enableColumnFilter: false,
      cell: ({ row }) => (
        <div className=" font-medium text-green-500 ml-9 lowercase">
          {row.original.approvedQuantityByPack}{' '}
          {pluralize(row.original.packUnit, row.original.approvedQuantityByPack)}
        </div>
      )
    },
    {
      header: 'Defect Quantity',
      accessorKey: 'defectQuantityByPack',
      enableColumnFilter: false,
      cell: ({ row }) => (
        <div className=" font-medium text-red-500 ml-5 lowercase">
          {row.original.defectQuantityByPack}{' '}
          {pluralize(row.original.packUnit, row.original.defectQuantityByPack)}
        </div>
      )
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
          <div className="flex items-center gap-4" style={{ maxWidth: '200px' }}>
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="Material"
                className="w-12 h-12 object-cover rounded border border-gray-300"
                style={{ flexShrink: 0 }}
              />
            ) : (
              <div
                className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-sm font-medium"
                style={{ flexShrink: 0 }}>
                No Image
              </div>
            )}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span
                    className="text-left font-medium text-gray-800 truncate cursor-pointer"
                    style={{
                      flexGrow: 1,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                    {variantName}
                  </span>
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-gray-800 text-white p-2 rounded shadow">
                  {variantName}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
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
        <div className="ml-9 text-primaryDark font-semibold lowercase">
          {row.original.quantityByPack}{' '}
          {pluralize(row.original.packUnit, row.original.quantityByPack)}
        </div>
      )
    },
    {
      header: 'Quantity by UOM',
      accessorKey: 'uomPerPack',
      enableColumnFilter: false,
      cell: ({ row }) => (
        <div className="ml-9 text-primaryLight font-semibold">
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
          <div className="flex items-center gap-4" style={{ maxWidth: '200px' }}>
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="Product"
                className="w-12 h-12 object-cover rounded"
                style={{ flexShrink: 0 }}
              />
            ) : (
              <div
                className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center"
                style={{ flexShrink: 0 }}>
                No Image
              </div>
            )}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span
                    className="text-left font-medium truncate cursor-pointer"
                    style={{
                      flexGrow: 1,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                    {productName}
                  </span>
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-gray-800 text-white p-2 rounded shadow">
                  {productName}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
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
      cell: ({ row }) => (
        <div className="text-center text-lg font-medium">{row.original.quantityByPack} </div>
      )
    }
  ];

  let formattedDetailsPostInspection: ColumnTypeForPostInspection[] = [];
  if (importRequest?.inspectionRequest && importRequest.inspectionRequest.length > 0) {
    const inspectionReport = importRequest.inspectionRequest[0].inspectionReport;
    if (inspectionReport && inspectionReport.inspectionReportDetail) {
      formattedDetailsPostInspection = inspectionReport.inspectionReportDetail
        .map((detail) => {
          const item = detail.materialPackage || detail.productSize;
          const imageUrl =
            detail.materialPackage?.materialVariant?.image ||
            detail.productSize?.productVariant?.image;
          const packUnit =
            (detail.materialPackage?.packUnit ||
              item?.productVariant?.product?.productUom?.uomCharacter) ??
            'N/A';

          return {
            id: detail.id,
            name: item?.name ?? 'N/A',
            code: item?.code ?? 'N/A',
            image: imageUrl ?? null, // Image for both material and product
            packUnit, // Include pack unit for later use
            quantityByPack: detail.quantityByPack ?? 0,
            approvedQuantityByPack: detail.approvedQuantityByPack ?? 0,
            defectQuantityByPack: detail.defectQuantityByPack ?? 0
          };
        })
        .filter((item) => item.quantityByPack > 0);
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
