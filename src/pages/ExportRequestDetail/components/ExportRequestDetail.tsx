import { DataTable } from '@/components/ui/DataTable';
import { CustomColumnDef } from '@/types/CompositeTable';
import { useSelector } from 'react-redux';
import exportRequestSelector from '../slice/selector';
import { MaterialExportRequest } from '@/types/exportRequest';
import { UOM } from '@/types/MaterialTypes';
import { convertTitleToTitleCase } from '@/helpers/convertTitleToCaseTitle';
import { formatNumber } from '@/helpers/formatNumber';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useEffect, useState } from 'react';
import { checkExportRequestDetailQuantityFn } from '@/api/services/exportRequestDetailApi';
import { MdOutlineWarningAmber } from 'react-icons/md';
import { AiOutlineCheckCircle } from 'react-icons/ai';
import Colors from '@/constants/color';

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
  image: any;
  isFulfilled: boolean | null;
  requiredQuantity: number;
  remainQuantityByPack: number;
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
  image: any;
}

const ExportRequestDetail = () => {
  const exportRequest: MaterialExportRequest = useSelector(exportRequestSelector.exportRequest);
  const exportRequestStatus = exportRequest?.status;
  const [fulfillmentStatuses, setFulfillmentStatuses] = useState<
    Record<
      string,
      { isFulfilled: boolean | null; requiredQuantity: number; remainQuantityByPack: number } | null
    >
  >({});
  const [loading, setLoading] = useState<boolean>(true);

  const details = exportRequest?.materialExportRequestDetail ?? [];
  let formattedDetails: ColumnType[] = [];

  const fetchFulfillmentStatuses = async (details: any[]) => {
    setLoading(true);
    const statuses: Record<
      string,
      {
        isFulfilled: boolean | null;
        requiredQuantity: number;
        remainQuantityByPack: number;
      }
    > = {};

    details.forEach((detail) => {
      statuses[detail.id] = {
        isFulfilled: null,
        requiredQuantity: 0,
        remainQuantityByPack: 0
      };
    });

    try {
      await Promise.all(
        details.map(async (detail) => {
          try {
            const response = await checkExportRequestDetailQuantityFn(detail.id);
            console.log(response?.data);
            statuses[detail.id] = {
              isFulfilled: response?.data?.isFullFilled ?? null,
              requiredQuantity: response?.data?.requiredQuantity ?? 0,
              remainQuantityByPack: response?.data?.availableQuantity ?? 0
            };
          } catch (error) {
            console.error(`Failed to fetch status for detail ${detail.id}:`, error);
            statuses[detail.id] = {
              isFulfilled: false,
              requiredQuantity: 0,
              remainQuantityByPack: 0
            };
          }
        })
      );
      setFulfillmentStatuses((prev) => ({ ...prev, ...statuses }));
    } catch (error) {
      console.error('Failed to fetch fulfillment statuses:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (details.length > 0) {
      fetchFulfillmentStatuses(details);
    }
  }, [details]);

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
      materialType: detail.materialVariant?.material?.name ?? 'N/A',
      image: detail.materialVariant?.image || null,
      isFulfilled: fulfillmentStatuses[detail.id]?.isFulfilled ?? null,
      requiredQuantity: fulfillmentStatuses[detail.id]?.requiredQuantity ?? 0,
      remainQuantityByPack: fulfillmentStatuses[detail.id]?.remainQuantityByPack ?? 0
    }));
  }
  // console.log(formattedDetails);

  const DetailsColumn: CustomColumnDef<ColumnType>[] = [
    {
      header: 'Material',
      accessorKey: 'materialName',
      enableColumnFilter: false,
      cell: ({ row }) => {
        const imageUrl = row.original.image;
        const materialName = row.original.materialName;
        return (
          <div className="flex items-center gap-4" style={{ maxWidth: '180px' }}>
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
                    className="text-left font-medium truncate cursor-pointer"
                    style={{
                      flexGrow: 1,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                    {materialName}
                  </span>
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-gray-800 text-white p-2 rounded shadow">
                  {materialName}
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
      cell: ({ row }) => (
        <div
          className="text-left"
          style={{ maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {row.original.code}
        </div>
      )
    },
    {
      header: 'Material Type',
      accessorKey: 'materialType',
      enableColumnFilter: false,
      cell: ({ row }) => (
        <div
          className="text-left font-semibold text-gray-700"
          style={{
            maxWidth: '150px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
          {row.original.materialType}
        </div>
      )
    },
    {
      header: 'Quantity By UOM',
      accessorKey: 'quantityByUOM',
      enableColumnFilter: false,
      cell: ({ row }) => (
        <div className="text-primaryDark ml-7 font-semibold">
          {formatNumber(row.original.quantityByUOM)}{' '}
          {convertTitleToTitleCase(row.original.uom.uomCharacter)}
        </div>
      )
    },
    {
      header: 'Required',
      accessorKey: 'requiredQuantity',
      enableColumnFilter: false,
      cell: ({ row }) => {
        if (exportRequestStatus !== 'PENDING') {
          return <div className="text-center text-xl mr-14">-</div>;
        }
        return (
          <div className="text-red-600 ml-5 text-lg font-semibold">
            {formatNumber(row.original.requiredQuantity)}
          </div>
        );
      }
    },
    {
      header: 'Remaining',
      accessorKey: 'remainQuantityByPack',
      enableColumnFilter: false,
      cell: ({ row }) => {
        // Hide the column if the export request status is PENDING
        if (exportRequestStatus !== 'PENDING') {
          return <div className="text-center text-xl mr-14">-</div>;
        }

        return (
          <div className="text-primaryLight text-lg ml-6 font-semibold">
            {formatNumber(row.original.remainQuantityByPack)}
          </div>
        );
      }
    },
    {
      header: 'Is Fulfilled',
      accessorKey: 'isFulfilled',
      enableColumnFilter: false,
      cell: ({ row }) => {
        const isFulfilled = row.original.isFulfilled;
        // Hide the column if the export request status is PENDING
        if (exportRequestStatus !== 'PENDING') {
          return <div className="text-center text-xl mr-14">-</div>;
        }

        if (isFulfilled === null || loading) {
          return <span>Loading...</span>;
        }

        return (
          <div className={`font-bold ml-6 ${isFulfilled ? 'text-green-700' : 'text-yellow-700'}`}>
            {isFulfilled ? (
              <AiOutlineCheckCircle className="w-7 h-7" color={Colors.green[700]} />
            ) : (
              <MdOutlineWarningAmber className="w-7 h-7" color={Colors.yellow[700]} />
            )}
          </div>
        );
      }
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
      detail.materialReceipt.materialPackage.materialVariant.material.materialUom.uomCharacter,
    image: detail.materialReceipt.materialPackage.materialVariant.image
  }));

  const ReceiptDetailsColumn: CustomColumnDef<ReceiptDetailColumnType>[] = [
    {
      header: 'Material',
      accessorKey: 'materialName',
      enableColumnFilter: false,
      cell: ({ row }) => (
        <div className="flex items-center gap-4" style={{ maxWidth: '200px' }}>
          {row.original.image ? (
            <img
              src={row.original.image}
              alt="Material"
              className="w-10 h-10 object-cover rounded border border-gray-300"
              style={{ flexShrink: 0 }}
            />
          ) : (
            <div
              className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center text-sm font-medium"
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
                  {row.original.materialName}
                </span>
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-gray-800 text-white p-2 rounded shadow">
                {row.original.materialName}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )
    },
    {
      header: 'Material Code',
      accessorKey: 'materialCode',
      enableColumnFilter: false,
      cell: ({ row }) => (
        <div
          className="text-left"
          style={{
            maxWidth: '150px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
          {row.original.materialCode}
        </div>
      )
    },
    {
      header: 'Package Name',
      accessorKey: 'packageName',
      enableColumnFilter: false,
      cell: ({ row }) => (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className="text-left truncate cursor-pointer"
                style={{
                  maxWidth: '200px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                {row.original.packageName}
              </div>
            </TooltipTrigger>
            <TooltipContent side="top" className="bg-gray-800 text-white p-2 rounded shadow">
              {row.original.packageName}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
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
